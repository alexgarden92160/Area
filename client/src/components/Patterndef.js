import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import about from "../about.json"
import rea from "../reaction.json"
import axios from "axios";
import Reaction from "./Reaction";
import Home from "../pages/Home";

export default function Patterndef(props) {

    let name = props.name;
    let id = props.id;
    let value = []
    let nAction = props.actionName
    let savevalue = ""
    let reactionname = ""

    async function getInformation() {
        await axios.post("http://onearea.online:3000/action/getall", {
            id: sessionStorage.getItem("id")
        }).then((res) => {
            // for (var i = 0; i < name.length; i++) {
            //     savevalue += res.data.actions[id][name[i]]
            //     if (i < name.length - 1)
            //         savevalue += ","
            // }
            // sessionStorage.setItem("VALUE", savevalue)
            sessionStorage.setItem("REACTION", res.data.actions[id].reactions[0].name)
        })
        //value = sessionStorage.getItem("VALUE").split(',')
        reactionname = sessionStorage.getItem("REACTION")
        sessionStorage.removeItem("VALUE")
        sessionStorage.removeItem("REACTION")
    }

    function create_front() {
        getInformation()
        let final = []
        let save = ""

        console.log(nAction)
        final.push(<p>{nAction}</p>)

        for (var i = 0; i < name.length; i++) {
            // save = name[i] + " : " + value[i]
            // final.push(<p>{save}</p>);
            final.push(<p>{name[i]}</p>)
        }
        final.push(<p>{reactionname}</p>)
        return final
    }

    return (
        <Draggable>
            <div className='widget'>
                <button className="cross" onClick={() => { Home.instance.removeComp(sessionStorage.getItem("id"), id); window.location.reload() }}> X</button>
                {create_front()}
            </div>
        </Draggable>
    );
}