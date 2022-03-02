import React from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Hservice from '../components/Handlingserv';
import Popup from '../components/Popup';
import Weather from '../components/Weather'
import Mail from '../components/Mail'
class Home extends React.Component {
  static instance;
  // constructor(props) {
  //   super(props);
  //   Home.instance = this;
  //   this.state = { components: [], ids: [] };
  //   this.cpt = 0;
  //   this.loadWidgets();
  // }

  // addComp(comp) {
  //   console.log(comp.type.name);
  //   var tmp = JSON.parse(sessionStorage.getItem("widgets"))
  //   tmp.list.push(comp.type.name);
  //   sessionStorage.setItem("widgets", JSON.stringify(tmp));
  //   console.log(sessionStorage.getItem("widgets"));
  //   axios.post("http://localhost:8080/widgets/add", {
  //     id: sessionStorage.getItem("id"),
  //     widgets: sessionStorage.getItem("widgets")
  //   }).then(() => {
  //     this.addComponent(comp)
  //   })
  // }

  // addComponent(comp) {
  //   var tmpcomp = this.state.components;
  //   var tmpids = this.state.ids;
  //   tmpcomp.push(comp);
  //   tmpids.push(this.cpt);
  //   this.cpt += 1;
  //   console.log(`new comp = ${this.cpt}`)
  //   this.setState({ components: tmpcomp, ids: tmpids });
  // }

  // loadWidgets() {
  //   var tmp = JSON.parse(sessionStorage.getItem("widgets"))
  //   tmp.list.forEach((value) => {
  //     this.addComponent(this.getElementFromName(value))
  //   })
  // }

  // getCurrentId() {
  //   var tmp = this.cpt;
  //   console.log(tmp);
  //   return tmp;
  // }

  // removeComp(id) {
  //   console.log(`removing${id}`)
  //   var tmpcomp = this.state.components;
  //   var tmpids = this.state.ids;
  //   var tmplist = JSON.parse(sessionStorage.getItem("widgets"))
  //   const index = this.state.ids.indexOf(id);
  //   if (index > -1) {
  //     tmpcomp.splice(index, 1);
  //     tmpids.splice(index, 1);
  //     tmplist.list.splice(index, 1);
  //   }
  //   sessionStorage.setItem("widgets", JSON.stringify(tmplist));
  //   axios.post("http://localhost:8080/widgets/add", {
  //     id: sessionStorage.getItem("id"),
  //     widgets: sessionStorage.getItem("widgets")
  //   })
  //   this.setState({ components: tmpcomp, ids: tmpids })
  // }

  // getElementFromName(value) {
  //   if (value === "Airlines")
  //     return <Airlines id={this.getCurrentId()} />
  //   if (value === "Cinema")
  //     return <Cinema id={this.getCurrentId()} />
  //   if (value === "Exchange")
  //     return <Exchange id={this.getCurrentId()} />
  //   if (value === "Weather")
  //     return <Weather id={this.getCurrentId()} />
  //   if (value === "Dictionnary")
  //     return <Dictionnary id={this.getCurrentId()} />
  //   if (value === "Crypto")
  //     return <Crypto id={this.getCurrentId()} />
  // }

  state = {
    visible: false
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
          </div>
        </header >
        <div className='home'>
          <div className='welcome'>
            <Popup
              visible={this.state.visible}
              hide={this.hide} />
            <Mail />
            {/* <p>Bienvenue {sessionStorage.getItem("name")}</p> */}
          </div>
        </div>
      </body>
    )
  }
}

export default Home;