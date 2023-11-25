import './App.css';
import { Navbar } from './components/Navbar';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Matching } from './pages/Matching';
import { ShortAnswer } from './pages/ShortAnswer';
import { Testing } from './pages/Testing';
import { Deck } from './pages/Deck';

function App() {

  return (
    <div className="App">
      <h1>
        REACT STUDY APP
      </h1>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/decks' element={<Deck/>}/>
          <Route path='/home' element={<Home />} />
          <Route path='/matching' element={<Matching />} />
          <Route path='/shortanswer' element={<ShortAnswer/>}/>
          <Route path='/testing' element={<Testing/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
