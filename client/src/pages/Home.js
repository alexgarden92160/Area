import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Hservice from '../components/Handlingserv';
import Popup from '../components/Popup';
import Weather from '../components/Weather'
import Mail from '../components/Mail'
import Pattern from '../components/Pattern';
import axios from 'axios';
import Global from '../global';
import about from '../about.json';
import React, { useState } from "react";
import Patterndef from '../components/Patterndef';

class Home extends React.Component {
  static instance;
  constructor(props) {
    super(props);
    Home.instance = this;
    this.state = { actions: [], visible: false };
    //   this.cpt = 0;
    this.loadAvailableAc();
  }

  addActions(comp) {
    var comptmp = this.state.actions
    //   console.log(comp.type.name);
    //   var tmp = JSON.parse(sessionStorage.getItem("widgets"))
    comptmp.push(comp);
    this.setState({ actions: comptmp });

    //   sessionStorage.setItem("widgets", JSON.stringify(tmp));
    //   console.log(sessionStorage.getItem("widgets"));
    //   axios.post("http://localhost:8080/widgets/add", {
    //     id: sessionStorage.getItem("id"),
    //     widgets: sessionStorage.getItem("widgets")
    //   }).then(() => {
    //     this.addComponent(comp)
    //   })
  }

  // addComponent(comp) {
  //   var tmpcomp = this.state.components;
  //   var tmpids = this.state.ids;
  //   tmpcomp.push(comp);
  //   tmpids.push(this.cpt);
  //   this.cpt += 1;
  //   console.log(`new comp = ${this.cpt}`)
  //   this.setState({ components: tmpcomp, ids: tmpids });
  // }

  loadAction(nm, i) {
    let params = []
    let n = []
    let value = []
    let reac = []

    for (var a = 0; a < about.services.length; a++) {
      for (var b = 0; b < about.services[a].actions.length; b++) {
        if (nm === about.services[a].actions[b].name) {
          for (var c = 0; c < about.services[a].actions[b].parameters.length; c++) {
            params.push(about.services[a].actions[b].parameters[c].type)
            n.push(about.services[a].actions[b].parameters[c].name)
            if (about.services[a].actions[b].parameters[c].type === "list")
              value.push(about.services[a].actions[b].parameters[c].values)
            value.push([])
          }
        }
      }
    }
    // about.services.map((a) => {
    // a.action.map((b) => {
    //   if (b.name === nm) {
    //     b.parameters.map((c) => {
    // params.push(c.type)
    // n.push(c.name)
    // if (c.type === "list")
    //   value.push(c.values)
    // else
    //   value.push([])
    //     })
    //   }
    // })
    // })
    //this.addActions(<Patterndef actionName={nm} type={params} name={n} val={value} reac={reac} />)
    this.addActions(<Patterndef actionName={nm} name={n} id={i} />)
  }
  async loadAvailableAc() {
    await axios.post("http://onearea.online:3000/action/getall", {
      id: sessionStorage.getItem("id")
    }).then(res => {
      let data = []
      res.data.actions.map((a) => {
        data.push(a.name)
      })
      sessionStorage.setItem("actionSet", data)
    })
    var data = sessionStorage.getItem("actionSet").split(",");
    console.log(data.length)
    for (var i = 0; i < data.length; i++) {
      if (data[i] != "") {
        this.loadAction(data[i], i)
      }
    }
    sessionStorage.removeItem("NAME")
    sessionStorage.removeItem("VALUE")
    sessionStorage.removeItem("REACTION")
  }

  // loadWidgets() {
  //   var tmp = JSON.parse(sessionStorage.getItem("widgets"))
  //   tmp.list.forEach((value) => {
  //     this.addAction(this.getElementFromName(value))
  //   })
  // }

  // getCurrentId() {
  //   var tmp = this.cpt;
  //   console.log(tmp);
  //   return tmp;
  // }

  removeComp(id, action_id) {
    // console.log(`removing${id}`)
    // var tmpcomp = this.state.components;
    // var tmpids = this.state.ids;
    // var tmplist = JSON.parse(sessionStorage.getItem("widgets"))
    // const index = this.state.ids.indexOf(id);
    // if (index > -1) {
    //   tmpcomp.splice(index, 1);
    //   tmpids.splice(index, 1);
    //   tmplist.list.splice(index, 1);
    // }
    // sessionStorage.setItem("widgets", JSON.stringify(tmplist));
    // axios.post("http://localhost:8080/widgets/add", {
    //   id: sessionStorage.getItem("id"),
    //   widgets: sessionStorage.getItem("widgets")
    // })
    // this.setState({ components: tmpcomp, ids: tmpids })
    axios.post("http://onearea.online:3000/action/remove", {
      id: id,
      actionId: action_id
    }).then(res => console.log(res))

  }


  switch = () => {
    if (this.state.visible === true) {
      this.setState({
        visible: false
      })
    } else {
      this.setState({
        visible: true
      })
    }

  }

  render() {
    return (
      <body>
        <header>
          <h1 className="title">AREA</h1>
          <div className="buttonplace">
            <Hservice className='bt' name="My Services" dir="/subscription"
            />
            <button className='bt' onClick={this.switch}> Add</button>
            <Hservice className='profile' name="Profile" dir="/profile" />
          </div>
        </header >
        <div className='home'>
          <div className='welcome'>
            <Popup
              visible={this.state.visible}
              hide={this.hide} />

            <div>{this.state.actions}</div>

          </div>
        </div>
      </body>
    )
  }
}

export default Home;