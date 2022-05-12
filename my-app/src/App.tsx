import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Profanity from './Profanity';

const App = () => {
  return (
      <Router>
        <div className="App">
          <Navbar/>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/profanity" element={<Profanity/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
