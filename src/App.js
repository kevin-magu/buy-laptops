import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Store from './pages/Store';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';

import Navbar from './components/Homepage/Navbar';
import Footer from './components/Homepage/Footer';


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/store" element={<Store/>} />
        <Route exact path="/upload" element ={<Upload />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={ <Register />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path='/cart' element={<Cart />} />
      </Routes>

      <Footer/>
    </Router>
  );
}

export default App;
