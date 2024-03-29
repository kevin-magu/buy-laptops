import { BsGoogle } from "react-icons/bs"
import { Link } from "react-router-dom"
function RegisterForm() {
  return (
    <div className="loginform">
    <form method="post"> 
    <p>Register using your email and passowrd</p>
        <input type="text" placeholder="enter your email" />
        <input type="password" placeholder="enter your password" />
        <button>REGISTER</button>
        <p className="google-paragraph"><BsGoogle className="google-logo"/> Register With google</p>
        <p className="register-paragraph">Already have an account? <Link className="linkto" to="/login">Login here</Link></p>
    </form>
</div>
  )
}

export default RegisterForm