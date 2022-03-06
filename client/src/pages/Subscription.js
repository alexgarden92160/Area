import React, { useEffect } from 'react';
import Header from '../components/Header';
import Popup from 'reactjs-popup';
import Services from '../components/Services'
import Hservice from '../components/Handlingserv';
import Global from '../global';

class Subscription extends React.Component {
  static instance;
  constructor(props) {
    super(props);
    Global.setUserId(parseInt(sessionStorage.getItem("id")))
    Global.loadData()
    Global.loadUserData()
  }

  state = {
    activate: "activate"
  }

  acdesac = () => {
    if (this.state.activate === "activate") {
      this.setState({ activate: "deactivate" })
    } else {
      this.setState({ activate: "activate" })
    }
  }


  render() {
    return (
      <body>
        <header>
          <h1 className="title">AREA</h1>
        </header >
        <div className='mastersub'>
          <Services name="weather" />
          <Services name="crypto" />
          <Services name="youtube" />
          <Services name="intra" />
          <Services name="covid" />
          <Services name="area" />
        </div>

      </body>
    )
  }
}

export default Subscription;