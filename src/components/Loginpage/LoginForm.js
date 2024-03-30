import { Link, useNavigate } from "react-router-dom"
import { BsGoogle } from "react-icons/bs"

import { getAuth,signInWithEmailAndPassword,GoogleAuthProvider,AuthErrorCodes,signInWithPopup } from "firebase/auth"
import {FirebaseError} from 'firebase/app'
import { useState, useEffect } from "react"




function LoginForm(){
//usestates
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [ errorMessage, setErrorMessage] = useState(false);
const [isLoading, setIsLoading] = useState(false)
const navigate = useNavigate()

const auth = getAuth();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        setIsLoading(true);
        const login = await signInWithEmailAndPassword(auth, email, password);
        navigate('/store?status=success')
    } catch (error) {
        setIsLoading(false);
        console.log(error);
        if (error.code) {
            if (error.code === 'auth/invalid-credential') {
                setErrorMessage('Wrong login credentials.')
            } else if (error.code === 'auth/wrong-password') {
                setErrorMessage('Wrong password. Please try again')
            } else if (error.code === 'auth/network-request-failed') {
                setErrorMessage('Network error');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Invalid email address');
            } else {
                setErrorMessage('An error occurred. Please try again')
            }
        } else {
            setErrorMessage('An unexpected error occurred. Please try again')
        }
    }
};


//handle Google login
const handleSignInWithGoogle =async ()=>{
    try{
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider);
        navigate('/store?status=success')
    }catch(error){
        setErrorMessage('An error occured. Please try again')
    }
}
//handle error satus
useEffect(()=>{
    const timeout = setTimeout(() => {
      setErrorMessage('')
    }, 5000);
      return()=>clearTimeout(timeout);
  
  },  [errorMessage])


    return(
        <div className="loginform">
            <form onSubmit={handleLogin}> 
            <p className="error-message">{errorMessage}</p>
            <p>Login using your email and passowrd</p>
                <input type="text" placeholder="enter your email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                <input type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button disabled={isLoading}>{isLoading? 'Login you in..': 'LOGIN'}</button>

                <p className="google-paragraph"><BsGoogle className="google-logo" onClick={handleSignInWithGoogle}/> Login With google</p>
                <p className="register-paragraph">Don't have an account? <Link className="linkto" to="/register">Register here</Link></p>
            </form>
        </div>
    )
}
export default LoginForm