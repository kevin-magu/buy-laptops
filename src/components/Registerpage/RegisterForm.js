import { BsGoogle } from "react-icons/bs"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

//firebase initialization
import {getAuth, createUserWithEmailAndPassword, AuthErrorCodes, GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import { useEffect, useState } from "react";

function RegisterForm() {
// use states
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();
const auth = getAuth();

//error message handler
useEffect(()=>{
  const timeout = setTimeout(() => {
    setErrorMessage('')
  }, 5000);
    return()=>clearTimeout(timeout);

},  [errorMessage])

//registration with email and password function
const handleRegister = async (e)=>{
  e.preventDefault();

  try{
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email,password);
    navigate('/login');
  }catch(error){
    setIsLoading(false);
    if(error.code === AuthErrorCodes.EMAIL_EXISTS){
      setErrorMessage('Email is already in use!')
    }else if(error.code==='auth/network-request-failed'){
      setErrorMessage('Network connection error');
    }else if(password.length< 5){
      setErrorMessage('password characters should be > 5')
    }
    else{
      setErrorMessage('An error occured. please try again.')
    }
  }

};

//handle signin with google
const handleSignInWithGoogle = async () =>{
  try{
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate('/store?status=signin=success')
  }catch(error){
    setErrorMessage("An error occured")
  }
}

// rendering the components
  return (
    <div className="loginform">
    <form onSubmit={handleRegister}> 
    <p className="error-message">{errorMessage}</p>
    <p>Register using your email and passowrd</p>
        <input type="text" placeholder="enter your email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
        <input type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <button disabled={isLoading}>{isLoading? 'Registering user...': 'REGISTER'}</button>

        <p className="google-paragraph" onClick={handleSignInWithGoogle}><BsGoogle className="google-logo"/> Signin With google</p>
        <p className="register-paragraph">Already have an account? <Link className="linkto" to="/login">Login here</Link></p>
    </form>

</div>
  )
console.log(auth)
}

export default RegisterForm