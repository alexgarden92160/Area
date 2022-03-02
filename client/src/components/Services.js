import Header from './Header';
import Popup from 'reactjs-popup';
import Service from '../Service.json'
import React, { useState, useEffect } from "react";
import axios from 'axios';

function Services(props) {
  const [ac, setAc] = useState(null);


  const getactivation = async (e) => {
    axios.post(
      `http://localhost:8080/active/get`, {
      service: props.name
    }
    ).then(res => setAc(res.data))
  };

  useEffect(() => {
    getactivation()
  }, []);

  const checkac = () => {

    if (ac === true)
      return "Deactivate"
    else
      return "Activate"
  }

  const acdesac = () => {
    if (ac === false) {
      setAc(true)
      axios.post(
        `http://localhost:8080/active/set`, {
        service: props.name,
        state: true
      }
      ).then(res => console.log(false))
    } else {
      setAc(false)
      axios.post(
        `http://localhost:8080/active/set`, {
        service: props.name,
        state: false
      }
      ).then(res => console.log(true))
    }
  }

  return (
    <div className='sub'>
      <p>{props.name}</p>
      <div className='activatesub'>
        <button onClick={acdesac}>{checkac()}</button>
        {console.log(ac)}
      </div>
    </div>
  )
}

export default Services;