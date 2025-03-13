import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TimeLine from './components/Timeline/TimeLine.jsx'
import './App.css'
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TimeLine />
    </DndProvider>
  );
}

export default App;
