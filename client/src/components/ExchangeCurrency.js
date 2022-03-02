import React, { useState } from "react";
import axios from 'axios';
import Home from '../pages/Home';

import Draggable from 'react-draggable';

const B_URL = 'https://freecurrencyapi.net/api/v2/latest?'
const TOKEN = '22b7c5b0-5293-11ec-a1dd-217befb05ab1'
let total = ''

function Exchange(props) {
    const [result, setResult] = useState({});
    const [BASE, setBase] = useState("");
    const [CURRENCY, setCurrency] = useState("");
    const [CODE, setCode] = useState("");
    const id = props.id;

    const getBase = async (e) => {
        e.preventDefault();

        axios.get(
            `${B_URL}apikey=${TOKEN}&base_currency=${BASE}`
        ).then(res => setResult(res.data.data))
        total = result[CODE] * CURRENCY
    }

    return (
        <Draggable>
            <div className="widget">
                <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
                <form onSubmit={getBase}>
                    <input placeholder='Enter base currency' value={BASE} onChange={(e) => setBase(e.target.value)} />
                    <p>TO</p>
                    <input placeholder='Enter target to convert' value={CODE} onChange={(e) => setCode(e.target.value)} />
                    <p>VALUE</p>
                    <input placeholder='Enter amount to convert' value={CURRENCY} onChange={(e) => setCurrency(e.target.value)} />
                    <button disabled={!BASE} disabled={!CODE} disabled={!CURRENCY} type="submit">Convert</button>
                </form>
                <div className='content'>
                    {total}
                </div>
            </div>
        </Draggable>
    )
}
export default Exchange;
