import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Clip } from './Clip';

export const Track = ({ track, onDrop, onResize, timeScale }) => {
  const dropRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'clip',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const rect = dropRef.current.getBoundingClientRect();
      const time = (offset.x - rect.left) / timeScale;
      onDrop(item.id, track.id, time);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={node => {
        dropRef.current = node;
        drop(node);
      }}
      className="track"
      style={{ backgroundColor: isOver ? '#eee' : 'white' }}
    >
      {track.clips.map(clip => (
        <Clip 
          key={clip.id} 
          clip={clip}
          trackId={track.id}
          onResize={onResize}
          timeScale={timeScale}
        />
      ))}
    </div>
  );
};