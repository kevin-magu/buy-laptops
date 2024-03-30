import { BsGoogle } from "react-icons/bs"
import { Link } from "react-router-dom"
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert"
import { useNavigate } from "react-router-dom";
//firebase initialization
import {getAuth, createUserWithEmailAndPassword, AuthErrorCodes} from 'firebase/auth'
import { useState } from "react";
function RegisterForm() {
// use states

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const navigate = useNavigate();

const auth = getAuth();
const handleRegister = async (e)=>{
  e.preventDefault();

  try{
    if(password.length<3){
      throw new Error('password should be > 3 characters')
    }
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email,password);
    navigate('/login');
  }catch(error){
    setIsLoading(false);
    if(error.code === AuthErrorCodes.EMAIL_EXISTS){
      setErrorMessage('Email is already in use')
    }else if(error.code==='auth/network-request-failed'){
      setErrorMessage('Network connection error');
    }else{
      setErrorMessage('An error occured. please try again')
    }
    setSnackbarOpen(true);
  }
};

  const handleSnackbarClose = () =>{
    setSnackbarOpen(false);
  }

  return (
    <div className="loginform">
    <form onSubmit={handleRegister}> 
    <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} className="error-status">
    <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
      {errorMessage}
    </MuiAlert>
    </Snackbar>
    <p>Register using your email and passowrd</p>
        <input type="text" placeholder="enter your email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
        <input type="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <button disabled={isLoading}>{isLoading? 'Registering user...': 'REGISTER'}</button>
        <p className="google-paragraph"><BsGoogle className="google-logo"/> Register With google</p>
        <p className="register-paragraph">Already have an account? <Link className="linkto" to="/login">Login here</Link></p>
    </form>

</div>
  )
}

export default RegisterForm