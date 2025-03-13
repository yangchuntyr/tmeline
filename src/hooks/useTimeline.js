import { useState, useCallback } from 'react';

export const useTimeline = () => {
  // 初始示例数据（可修改）
  const [tracks, setTracks] = useState([
    {
      id: 1,
      clips: [
        { id: 11, name: "Clip 1", start: 0, duration: 30 },
        { id: 12, name: "Clip 2", start: 104, duration: 20 }
      ]
    },
    {
      id: 22,
      clips: [
        { id: 23, name: "Clip 3", start: 2, duration: 40 }
      ]
    }
  ]);

  
  const [timeScale] = useState(100); // 100像素/秒

  // 移动片段到新位置
  const moveClip = useCallback((clipId, newTrackId, newStart) => {
    setTracks(prevTracks => {
      let targetClip = null;

      // 第一步：从原轨道移除片段
      const cleanedTracks = prevTracks.map(track => {
        const hasClip = track.clips.some(c => c.id === clipId);
        if (!hasClip) return track;

        return {
          ...track,
          clips: track.clips.filter(c => {
            if (c.id === clipId) {
              targetClip = { ...c, start: newStart };
              return false;
            }
            return true;
          })
        };
      });

      // 第二步：添加到新轨道（同时保留原有片段）
      return cleanedTracks.map(track => {
        if (track.id === newTrackId) {
          return {
            ...track,
            clips: [
              ...track.clips.filter(c => c.id !== clipId), // 防止重复
              targetClip
            ].sort((a, b) => a.start - b.start) // 按时间排序
          };
        }
        return track;
      });
    });
  }, []);

  // 调整片段时长
  const resizeClip = useCallback((clipId, delta, isStart) => {
    setTracks(prev => 
      prev.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id !== clipId) return clip;
          
          const durationChange = delta / timeScale;
          return {
            ...clip,
            start: isStart ? 
              Math.max(0, clip.start + durationChange) : // 防止负数
              clip.start,
            duration: Math.max(0.1, // 最小时长0.1秒
              clip.duration + (isStart ? -durationChange : durationChange)
            )
          };
        })
      }))
    );
  }, [timeScale]);

  // 创建新轨道
  const createTrack = useCallback((position) => {
    const newTrack = { 
      id: Date.now(), 
      clips: [] 
    };
    setTracks(prev => [
      ...prev.slice(0, position),
      newTrack,
      ...prev.slice(position)
    ]);
  }, []);

  return { 
    tracks, 
    moveClip, 
    resizeClip, 
    createTrack, 
    timeScale 
  };
};

