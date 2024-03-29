function LoginForm(){
    return(
        <div className="loginform">
            <form method="post"> 
            <p>Login using your email and passowrd</p>
                <input type="text" placeholder="enter your email" />
                <input type="password" placeholder="enter your password" />
            </form>
        </div>
    )
}
export default LoginForm