import axios from 'axios';
import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';

const B_URL = 'https://api.dictionaryapi.dev/api/v2/entries/fr'



function Dictionnary(props) {
    const [DATA, setData] = useState({});
    const [Word, setWord] = useState("");
    const id = props.id;


    const getBase = async (e) => {
        e.preventDefault();
        axios.get(`${B_URL}/${Word}`)
            .then(yes => setData(yes.data[0].meanings[0].definitions[0]))
    }
    return (
        <Draggable>
            <div className='widget'>
                <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
                <form onSubmit={getBase}>
                    <input placeholder='Enter a word' value={Word} onChange={(e) => setWord(e.target.value)} />
                    <button disabled={!Word} type="submit">Get meaning</button>
                </form>
                <div className='content'>
                    {DATA.definition}
                </div>
            </div>
        </Draggable>
    )
}
export default Dictionnary;