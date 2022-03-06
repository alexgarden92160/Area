import React, { useState, useEffect } from "react";
import axios from 'axios';
import Global from "../global";

function Services(props) {
  const [ac, setAc] = useState(Global.getServiceState(props.name) === true ? "Disable" : "Enable")
  const [vari, setVari] = useState("")

  useEffect(() => {
    console.log(Global.services)
    console.log("hello " + Global.getServiceState(props.name))
  }, [])

  const acdesac = async () => {
    console.log(Global.getServiceState(props.name))
    if (Global.getServiceState(props.name) === false) {
      setAc("Disable")
      Global.setServiceState(props.name, true)
      await axios.post(
        `http://onearea.online:3000/service/active/set`, {
        service_name: props.name,
        active_state: true,
        id: sessionStorage.getItem("id")
      }
      );
    } else {
      setAc("Enable")
      Global.setServiceState(props.name, false)
      await axios.post(
        `http://onearea.online:3000/service/active/set`, {
        service_name: props.name,
        active_state: false,
        id: sessionStorage.getItem("id")
      }
      )
    }
  }

  function check_service() {
    if (props.name === "intra") {
      return <input value={vari} onChange={(e) => setVari(e.target.value)} />
    }
    return
  }

  function send_token() {
    axios.post(`http://onearea.online:3000/service/token/set`, {
      service_name: props.name,
      token: vari,
      id: sessionStorage.getItem("id")
    }).then((res) => res)
  }
  return (
    <div className='sub'>
      <p>{props.name}</p>
      {check_service()}
      <div className='activatesub'>

        <button onClick={async () => { await acdesac(); send_token(); }}>{Global.getServiceState(props.name) === true ? "Disable" : "Enable"}</button>
      </div>
    </div>
  )
}

export default Services;