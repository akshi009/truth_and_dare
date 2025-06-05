
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId/lobby" element={<Lobby />} />
      <Route path="/room/:roomId/game" element={<Game />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
