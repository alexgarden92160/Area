import React from 'react';
import Header from '../components/Header';
import Popup from 'reactjs-popup';
import Services from '../components/Services'
import Hservice from '../components/Handlingserv';

class Subscription extends React.Component {
  static instance;
  // constructor(props) {
  //   super(props);
  // }

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
          <Services name="Weather" />
          <Services />
          <Services />
          <Services />
          <Services />
          <Services />
        </div>

      </body>
    )
  }
}

export default Subscription;