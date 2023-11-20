import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import './App.css';
import { useForm } from 'react-hook-form';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Matching } from './pages/Matching';

function App() {

  return (
    <div className="App">
      <header>
        ALVINS STUDY APP
      </header>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/matching' element={<Matching />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
