import { Link } from "react-router-dom";
import "../../style/Home.css"
import { MdAccountCircle } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { FaLaptop } from 'react-icons/fa';
import { MdHome } from 'react-icons/md';

import { useState, useEffect } from "react";
import { auth } from "../../Firebaseconfig";
import {getAuth, onAuthStateChanged} from 'firebase/auth';

function Navbar(){
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            setUser(user)
        });
        return()=>{
            unsubscribe();
        };
    }, [auth]); 

    return(
        <div className="navbar">
            <ul>
                <Link className="link" to="/"><li>Home <MdHome className="navicons" /> </li></Link>
                <Link className="link" to="/store"><li>Laptops <FaLaptop className="navicons" /> </li></Link>
                <li>About<BsInfoCircle  className="navicons" /> </li>
                <li className="cart">Cart <FaShoppingCart className="navicons cart" /> </li>
                <li>{user ? "Account": "Login"}  <MdAccountCircle className="navicons" /> </li>
               <Link to="/upload"><li>Upload</li></Link>

            </ul>
        </div>
    );
}
export default Navbar