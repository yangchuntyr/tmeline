import { Track } from './Track';
import { useTimeline } from '../../hooks/useTimeline';

 const Timeline = () => {
  const { tracks, moveClip, resizeClip, createTrack } = useTimeline();
  
  const handleDrop = (clipId, trackId, start) => {
    moveClip(clipId, trackId, start);
  };

  return (
    <div className="timeline">
      <div className="time-ruler">
        {/* 时间刻度渲染 */}
      </div>
      {tracks.map((track, index) => (
        <Track
          key={track.id}
          track={track}
          onResize={resizeClip} // 传递resize函数
          onDrop={handleDrop}
          timeScale={5}
          onCreateTrack={() => createTrack(index + 1)}
        />
      ))}
    </div>
  );
};

export default Timeline