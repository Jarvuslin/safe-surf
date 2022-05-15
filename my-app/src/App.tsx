import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Profanity from './Profanity';
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

const App = () => {
  return (
      <Router>
        <div className="App">
          <Navbar/>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/profanity" element={<Profanity/>}/>
              <Route path="/about-us" element={<AboutUs/>}/>
              <Route path="/contact-us" element={<ContactUs/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
