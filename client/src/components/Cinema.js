import React, { useState } from "react";
import axios from 'axios';
import Home from '../pages/Home';

import Draggable from 'react-draggable';

const B_URL = 'http://www.omdbapi.com/?'
const TOKEN = 'e050a26b'

function Cinema(props) {
  const [DATA, setData] = useState({});
  const [NAME, setName] = useState("");
  let RES;
  const id = props.id;


  const getBase = async (e) => {
    e.preventDefault();
    axios.get(
      `${B_URL}s=${NAME}&apikey=${TOKEN}`
    ).then(yes => setData(yes.data))
  }
  RES = DATA.Response

  if (RES === "False") {
    return (
      <Draggable>
        <div className='widget'>
          <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
          <form onSubmit={getBase}>
            <input placeholder='Enter movie name' value={NAME} onChange={(e) => setName(e.target.value)} />
            <button disabled={!NAME} type="submit">Search</button>
          </form>
          {DATA.Error}
        </div>
      </Draggable>
    )
  } else if (RES === "True") {
    return (
      <Draggable>
        <div className='widget'>
          <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>

          <form onSubmit={getBase}>
            <input placeholder='Enter movie name' value={NAME} onChange={(e) => setName(e.target.value)} />
            <button disabled={!NAME} type="submit">Search</button>
          </form>
          {/* <div className="content"> */}
          <img src={DATA.Search[0].Poster} /> <br />
          {DATA.Search[0].Title}
          {/* </div> */}
        </div>
      </Draggable>
    )
  } else {
    return (
      <Draggable>
        <div className='widget'>
          <button className='cross' onClick={() => { Home.instance.removeComp(id) }}>Close</button>
          <form onSubmit={getBase}>
            <input placeholder='Enter movie name' value={NAME} onChange={(e) => setName(e.target.value)} />
            <button disabled={!NAME} type="submit">Search</button>
          </form>
        </div>
      </Draggable>
    )
  }
}
export default Cinema;