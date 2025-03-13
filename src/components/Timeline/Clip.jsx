import { useDrag } from 'react-dnd';
import { useRef, useEffect } from 'react';

export const Clip = ({ clip, trackId, onResize, timeScale }) => {
  const leftHandleRef = useRef(null);
  const rightHandleRef = useRef(null);
  const isResizing = useRef(false);
  const initialParams = useRef({ start: 0, duration: 0 });
  const currentValues = useRef({ start: 0, duration: 0 });

  // 清理事件监听
  const cleanUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    isResizing.current = false;
  };

  useEffect(() => {
    return cleanUp; // 组件卸载时清理
  }, []);

  const handleResizeStart = (isStart, e) => {
    e.stopPropagation();
    if (isResizing.current) return;

    isResizing.current = true;
    initialParams.current = {
      start: clip.start,
      duration: clip.duration,
      startX: e.clientX,
      isStart
    };

    // window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const deltaX = e.clientX - initialParams.current.startX;
    const deltaTime = deltaX / timeScale;
    const isStart = initialParams.current.isStart;

    // 计算新值
    let newStart = initialParams.current.start;
    let newDuration = initialParams.current.duration;

    if (isStart) {
      newStart = Math.max(0, initialParams.current.start + deltaTime);
      newDuration = Math.max(0.5, initialParams.current.duration - deltaTime);
    } else {
      newDuration = Math.max(0.5, initialParams.current.duration + deltaTime);
    }

    // 更新ref存储当前值
    currentValues.current = { newStart, newDuration };

    // 实时更新UI
    const clipElement = isStart ? 
      leftHandleRef.current.parentElement : 
      rightHandleRef.current.parentElement;
    
    clipElement.style.width = `${newDuration * timeScale}px`;
    clipElement.style.left = `${newStart * timeScale}px`;
  };

  const handleMouseUp = () => {
    if (!isResizing.current) return;

    // 使用最终计算值更新状态
    const { isStart } = initialParams.current;
    const { newStart, newDuration } = currentValues.current;
    
    onResize(
      clip.id,
      isStart ? 
        initialParams.current.duration - newDuration : 
        newDuration - initialParams.current.duration,
      isStart
    );

    cleanUp();
  };

  // 拖拽逻辑保持不变
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'clip',
    item: { id: clip.id, trackId },
    collect: monitor => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div 
      ref={drag}
      className="clip"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        width: `${clip.duration * timeScale}px`,
        left: `${clip.start * timeScale}px`,
        transition: isResizing.current ? 'none' : 'left 0.2s, width 0.2s'
      }}
    >
      <div 
        ref={leftHandleRef}
        className="resize-handle left"
        onMouseDown={e => handleResizeStart(true, e)}
      />
      {clip.name}
      <div 
        ref={rightHandleRef}
        className="resize-handle right"
        onMouseDown={e => handleResizeStart(false, e)}
      />
    </div>
  );
};