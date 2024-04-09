import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router";
import { useState } from "react";

export const Login = () => {

    const navigate = useNavigate()
    const { store, actions } = useContext(Context);

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    return(
        <div>
        <form>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" onChange={(e) => setEmail(e.target.value)}></input>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" name ="password" onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button type="submit" className="btn btn-primary" onClick={() =>(
                actions.login(email, password)
            )}>Submit</button>
        </form>
        </div>
    )
}