import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';

const B_URL = 'http://api.aviationstack.com/v1/flights?flight_iata='
const TOKEN = 'a8b2ff35d2d848bfa9b0a04df9ed50d1'

let i = 0

function Airlines(props) {
    const [DATA, setData] = useState({});
    const [CODE, setCode] = useState("");
    const id = props.id;


    const getBase = async (e) => {
        e.preventDefault();
        axios.get(`${B_URL}${CODE}&access_key=${TOKEN}`)
            .then(yes => setData(yes.data.data))
        i = 1
    }
    if (i === 1 && DATA.length === 1) {
        return (
            <Draggable>
                <div className='widget'>
                    <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
                    <form onSubmit={getBase}>
                        <input placeholder='Enter flight number' value={CODE} onChange={(e) => setCode(e.target.value)} />
                        <button disabled={!CODE} type="submit">Get flight informations</button>
                    </form>
                    <div className='content'>
                        <p>From: {DATA[0].departure.airport} To: {DATA[0].arrival.airport}</p>
                        <p>Dep. terminal: {DATA[0].departure.terminal} Arr. terminal: {DATA[0].arrival.terminal}</p>
                        <p>Dep. gate: {DATA[0].departure.gate} Arr. gate: {DATA[0].arrival.gate}</p>
                        <p>Dep. : {DATA[0].departure.estimated}</p>
                        <p>Arr.: {DATA[0].arrival.estimated}</p>

                    </div>
                </div>
            </Draggable>
        )
    } else {
        return (
            <Draggable>
                <div className='widget'>
                    <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
                    <form onSubmit={getBase}>
                        <input placeholder='Enter flight number' value={CODE} onChange={(e) => setCode(e.target.value)} />
                        <button disabled={!CODE} type="submit">Get flight informations</button>
                    </form>
                </div>
            </Draggable>
        )
    }
}
export default Airlines;