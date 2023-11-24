import './App.css';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Matching } from './pages/Matching';
import { ShortAnswer } from './pages/ShortAnswer';
import { Testing } from './pages/Testing';

function App() {

  return (
    <div className="App">
      <h1>
        ALVINS STUDY APP
      </h1>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/studyApp' element={<Home />} />
          <Route path='/matching' element={<Matching />} />
          <Route path='/shortanswer' element={<ShortAnswer/>}/>
          <Route path='/testing' element={<Testing/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
