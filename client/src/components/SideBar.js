import React from 'react';
import Home from '../pages/Home'
import Weather from './Weather';
import Cinema from './Cinema';
import Exchange from './ExchangeCurrency';
import Dictionnary from "./Dictionnary"
import Crypto from "./Crypto"
import Airlines from "./Airlines"

const SideBar = () => {
    return (
        <div className='sidebar'>
            <button onClick={() => { Home.instance.addComp(<Weather id={Home.instance.getCurrentId()} />) }}>
                Coming soon...
            </button>
            <button onClick={() => { Home.instance.addComp(<Exchange id={Home.instance.getCurrentId()} />) }}>
                Coming soon...
            </button>
            <button onClick={() => { Home.instance.addComp(<Cinema id={Home.instance.getCurrentId()} />) }} >
                Coming soon...
            </button>
            <button onClick={() => { Home.instance.addComp(<Dictionnary id={Home.instance.getCurrentId()} />) }} >
                Coming soon...
            </button>
            <button onClick={() => { Home.instance.addComp(<Crypto id={Home.instance.getCurrentId()} />) }} >
                Coming soon...
            </button>
            <button onClick={() => { Home.instance.addComp(<Airlines id={Home.instance.getCurrentId()} />) }}>
                Coming soon...
            </button>
        </div >
    )
}

export default SideBar;