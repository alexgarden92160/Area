import React, { useState } from "react";
import Draggable from 'react-draggable';
import Home from '../pages/Home';
import Pattern from './Pattern';
import axios from 'axios';
import about from '../about.json'

function Popup(props) {
    let tab = []
    let params = []
    let n = []
    let value = []
    let reac = []

    const get_params = (nm) => {
        about.services.map((h) => {
            h.actions.map((z) => {
                if (nm === z.name) {
                    z.reactions.map((j) => {
                        reac.push(j)
                    })
                    z.parameters.map((i) => {
                        params.push(i.type)
                        n.push(i.name)
                        if (i.type === "list")
                            value.push(i.values)
                        else
                            value.push([])
                    }
                    )
                }
            });
        });
        let data = sessionStorage.getItem("actionSet").split(",")
        data.push(nm)
        sessionStorage.setItem("actionSet", data)
        Home.instance.addActions(<Pattern actionName={nm} type={params} name={n} val={value} reac={reac} />)
    }

    function fill_tab() {
        let name = ""
        about.services.map((h) => {
            if ((sessionStorage.getItem(h.name) === 'true') === true) {
                name = h.name
                tab.push(<p>{h.name}</p>);
                h.actions.map((z) => {
                    tab.push(<button onClick={() => get_params(z.name)}>{z.name}</button>);
                });
            }
        });
        return tab;
    }

    const res = fill_tab().map((h) => {
        return <li>{h}</li>
    });

    return (
        <Draggable>
            <div className='popup'
                style={{
                    transform: props.visible ? ' translateY(0vh' : 'translateY(-100vh)',
                    opacity: props.visible ? '1' : '0'
                }}>
                {/* {get_about()} */}
                <ul>{res}</ul>
            </div>
        </Draggable>

    )
}

export default Popup;