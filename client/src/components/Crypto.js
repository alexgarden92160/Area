import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';

const B_URL = 'https://api.coingecko.com/api/v3/coins/'


function Crypto(props) {
    const [DATA, setData] = useState({});
    const [Coin, setCoin] = useState("");
    const [Currency, setCurr] = useState("");
    const id = props.id;


    const getBase = async (e) => {
        e.preventDefault();
        axios.get(`${B_URL}/${Coin}`)
            .then(yes => setData(yes.data.market_data.current_price))
    }
    return (
        <Draggable>
            <div className='widget'>
                <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
                <form onSubmit={getBase}>
                    <input placeholder='Enter cryptocurrency name' value={Coin} onChange={(e) => setCoin(e.target.value)} />
                    <input placeholder='Enter target currency name' value={Currency} onChange={(e) => setCurr(e.target.value)} />
                    <button disabled={!Coin} type="submit">Convert</button>
                </form>
                <div className='content'>
                    {DATA[Currency]}
                </div>
            </div>
        </Draggable>
    )
}
export default Crypto;