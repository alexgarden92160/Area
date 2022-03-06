import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';

function Mail(props) {

    const [email, setEmail] = useState("");

    const sendEmail = async (e) => {
        e.preventDefault();
        axios.post(
            `http://localhost:8080/test-mail`, {
            email: email
        }

        ).then(res => console.log(res))
    };

    return (
        <Draggable>
            <div className='widget'>
                <form onSubmit={sendEmail}>
                    <input placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button disabled={!email} type="submit">Send</button>
                </form>
            </div>
        </Draggable>

    );
}

export default Mail;