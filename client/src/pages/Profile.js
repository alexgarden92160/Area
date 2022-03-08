import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


export default function Profile() {

    function loggout() {
        sessionStorage.setItem("isLoggedIn", false)
    }
    return (
        <body>
            <div className="menu">
                <header>
                    <h1 className="title">AREA</h1>
                </header >
                <div className='login'>
                    <h2>{sessionStorage.getItem("username")}</h2>

                    <button type="submit" onClick={loggout}>Loggout</button>

                </div>
            </div>
        </body>
    )
}