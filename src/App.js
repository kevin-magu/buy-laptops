import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';

import Navbar from './components/Homepage/Navbar';
import Footer from './components/Homepage/Footer';
import Store from './pages/Store';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/store" element={<Store/>} />
        <Route exact path="/upload" element ={<Upload />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
