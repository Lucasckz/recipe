/*
File: LoginForm.js
?: Handles input for Login usage 
*/ 
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Login.css';



function LoginForm({ setCheckFlag, setEmail, setPassword }) {
    //Basically declaring three strings but using the state. To my understanding, this gets wiped out after a refresh/change page
    //Name is not needed but this is what it will look like for submissions
    const [details, setDetails] = useState({email: "", password: ""});

    //Handles input
    //preventDefault stops the changeEvent so we can give Login what was given.
    const submitHandler = (e) => {
        e.preventDefault();

        setCheckFlag(true);
        setEmail(details.email);
        setPassword(details.password);
        // window.location.reload(false);
    }

    //Returns a form for giving an email and password. It also has a button! 
    //Notice our form has a onSubmit attribute to the above handler. Nice!
    //Anytime we change what's in the form, we call a function that passes a ChangeEvent to our setDetails so we can can assign our details!!
    return (
        <>
            <form onSubmit={submitHandler}>
                
                <div className="formEntry nobottomborder">
                    <h1>Welcome back!</h1>
                    
                    <label htmlFor="email">Email Address:</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        onChange={e => setDetails({...details, email: e.target.value})} 
                        value={details.email} 
                        style={{marginLeft: 30, width: 240}}
                    />
                </div>

                <div className="formEntry notopborder">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        onChange={e => setDetails({...details, password: e.target.value})} 
                        value={details.password}
                        style={{marginLeft: 58, width: 240}}
                    />
                    <input id="submitButton" type="submit" value="Sign in" /><br/>
                    <Link to="/register">New? Sign up!</Link>
                </div>
            </form>
        </>
    )
}

//Note to self: Forgot password

export default LoginForm;
