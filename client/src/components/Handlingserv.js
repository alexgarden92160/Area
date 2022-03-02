import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';
import { useNavigate } from "react-router"

function Hservice(props) {
    const navigation = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigation(props.dir, { replace: false });
        window.location.reload(false);
    }
    return (
        <div>
            <button className={props.className} onClick={handleClick}> {props.name}</button>
        </div>
    )
}

export default Hservice;