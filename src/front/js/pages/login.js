import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Login = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return(
        <div>
            <h1>Login</h1>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" onChange={(e) => setEmail(e.target.value)}></input>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" name ="password" onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button type="submit" className="btn btn-primary" onClick={async () => {
                if (await actions?.login(email, password) == "success"){
                    navigate("/private")
                }
                else{
                    console.log("Incorrect email or password")
                }
            }}>Submit</button>
            <div className="my-3">
                <a>Don't have an account?</a><br></br>
                <button onClick={() => {navigate("/signup")}}>Create account</button>
            </div>
        </div>
    );
}