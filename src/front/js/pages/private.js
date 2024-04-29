import React, { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {

    const navigate = useNavigate()
    const { store, actions } = useContext(Context);

    function VerifyToken () {
        let token = localStorage.getItem("jwt-token")
        if (token == ""){
            navigate("/login")
        }
    }

    useEffect(() => {
        VerifyToken()
      }, []);
    
    return(
        <div>
            <div>This is a private page</div>
            <button onClick={() => {
                actions.logout()
                navigate("/login")
            }}>Log Out</button>
        </div>
    )
}