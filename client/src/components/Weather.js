import axios from 'axios';
import React, { useState } from "react";
import Home from '../pages/Home';

import Draggable from 'react-draggable';

const APIKEY = "b70c4b6ba2de90aceabdbbb5d36eaf76";

export default function Weather(props) {

  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [sign, setSign] = useState("");
  const [result, setResult] = useState(null);

  const getWeather = async (e) => {
    e.preventDefault();
    if (!city) {
      return;
    }
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
    ).then(res => setResult(res.data.main.temp))
  };
  function Checkresult() {
    if (sign === "<") {
      if (parseInt(result - 273.15) < temp)
        return <p>popup</p>
    }
    if (sign === ">") {
      if (parseInt(result - 273.15) > temp)
        return <p>popup</p>
    }

    if (sign === "=") {
      if (parseInt(result - 273.15) === temp)
        return <p>popup</p>
    }
  }

  return (
    <Draggable>
      <div className='widget'>
        <button className='cross' onClick={() => { Home.instance.removeComp(props.id) }}>Close</button>
        <form onSubmit={getWeather}>
          <input placeholder='Enter city name' value={city} onChange={(e) => setCity(e.target.value)} />
          <input placeholder='Enter temperature' value={temp} onChange={(e) => setTemp(e.target.value)} />
          <select id="dropdown" onChange={(e) => setSign(e.target.value)}>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="=">=</option>
          </select>
          <button disabled={!city} type="submit">Get weather</button>
          {Checkresult()}
        </form>
      </div>
    </Draggable>

  );
}