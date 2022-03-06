import React, { useState } from "react";
import axios from 'axios';

function Services(props) {
  const [ac, setAc] = useState((sessionStorage.getItem(props.name) === 'true') === true ? "Disable" : "Enable")

  const acdesac = async () => {
    if ((sessionStorage.getItem(props.name) === 'true') === false) {
      setAc("Disable")
      sessionStorage.setItem(props.name, true);
      await axios.post(
        `http://onearea.online:3000/service/active/set`, {
        service_name: props.name,
        active_state: true,
        id: sessionStorage.getItem("id")
      }
      );
    } else {
      setAc("Enable")
      sessionStorage.setItem(props.name, false);
      await axios.post(
        `http://onearea.online:3000/service/active/set`, {
        service_name: props.name,
        active_state: false,
        id: sessionStorage.getItem("id")
      }
      )
    }
  }

  return (
    <div className='sub'>
      <p>{props.name}</p>
      <div className='activatesub'>
        <button onClick={async () => { await acdesac() }}>{(sessionStorage.getItem(props.name) === 'true') === true ? "Disable" : "Enable"}</button>
      </div>
    </div>
  )
}

export default Services;