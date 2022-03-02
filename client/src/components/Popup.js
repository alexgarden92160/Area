import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';
import { useNavigate } from "react-router";

function Popup(props) {

    const serv = ["Weather", "Youtube"]
    const disp = serv.map((h) => {
        if (true)
            return <li>{h}</li>

        return null
    }
    );
    return (
        <Draggable>
            <div className='popup'
                style={{
                    transform: props.visible ? ' translateY(0vh' : 'translateY(-100vh)',
                    opacity: props.visible ? '1' : '0'
                }}>
                <ul> {disp}</ul>
            </div>
        </Draggable>

    )
}

export default Popup;