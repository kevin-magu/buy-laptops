import { Link, useNavigate } from "react-router-dom";
import "../../style/Home.css"
import { MdAccountCircle } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { FaLaptop } from 'react-icons/fa';
import { MdHome } from 'react-icons/md'; 
import { MdExitToApp } from "react-icons/md";

import { useState, useEffect } from "react";
import { auth } from "../../Firebaseconfig";
import {getAuth, onAuthStateChanged,signOut} from 'firebase/auth';

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

    const navigate = useNavigate()
    //function to handle logout
    const handleLogout = async () =>{
        try{
            await signOut(auth)
            
            navigate('/?status=logoutSuccess');
        }catch(error){
            console.log(error);
        }
    }

    return(
        <div className="navbar">
            <ul>
                <Link className="link" to="/"><li>Home <MdHome className="navicons" /> </li></Link>
                <Link className="link" to="/store"><li>Laptops <FaLaptop className="navicons" /> </li></Link>
                <li>About<BsInfoCircle  className="navicons" /> </li>
                <li className="cart">Cart <FaShoppingCart className="navicons cart" /> </li>
               <Link className="link" to={user ? "/account" : "/login"} ><li>{user ? "Account": "Login"}  <MdAccountCircle className="navicons" /> </li></Link> 
               <li style={{ display: user ? 'block' : 'none' }} onClick={handleLogout}>Logout <MdExitToApp className="navicons" /> </li>

               <li>{user? user.email :""}</li>
            </ul>
        </div>
    );
}
// <Link to="/upload"><li></li></Link> 
export default Navbar