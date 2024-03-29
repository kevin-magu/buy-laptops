import { Link } from "react-router-dom"
import { BsGoogle } from "react-icons/bs"
function LoginForm(){
    return(
        <div className="loginform">
            <form method="post"> 
            <p>Login using your email and passowrd</p>
                <input type="text" placeholder="enter your email" />
                <input type="password" placeholder="enter your password" />
                <button>LOGIN</button>
                <p className="google-paragraph"><BsGoogle className="google-logo"/> Login With google</p>
                <p className="register-paragraph">Don't have an account? <Link className="linkto" to="/register">Register here</Link></p>
            </form>
        </div>
    )
}
export default LoginForm