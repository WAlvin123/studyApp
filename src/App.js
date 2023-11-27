import './App.css';
import { Navbar } from './components/Navbar';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Cards } from './pages/Cards';
import { Matching } from './pages/Matching';
import { ShortAnswer } from './pages/ShortAnswer';
import { Deck } from './pages/Deck';
import { MultipleChoice } from './pages/MultipleChoice';

// TODO: Clean up code (props, etc)
// TODO: firebase storage
// TODO: css styling

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
          <Route path='/cards' element={<Cards />} />
          <Route path='/matching' element={<Matching />} />
          <Route path='/shortanswer' element={<ShortAnswer/>}/>
          <Route path='/multiplechoice' element={<MultipleChoice/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
