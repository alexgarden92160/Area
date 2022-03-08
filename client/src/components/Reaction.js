import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import about from "../about.json"
import axios from "axios";

export default function Reaction(props) {

    let handl = []
    let jsonfinal;

    function compare_type(type, j, handl) {
        let save = []
        if (type === "string")
            return <input onChange={(e) => handl[j] = e.target.value} />
        else if (type === "list") {
            save.push(<option> </option>)
            props.val[j].map((a) => {
                save.push(<option Values={a}>{a}</option>)
            });
            return <select onChange={(e) => handl[j] = e.target.value}>{save}</select>
        }
    }

    function create_front() {
        let tab = []
        let tabt = []
        let final = []
        let j = 0;

        props.type.map((z) => {
            tab.push(compare_type(z, j, handl));
            handl.push("")
            j++;
        });
        props.name.map((a) => {
            tabt.push(<p className="title_name">{a}</p>)
        });

        for (var i = 0; i < props.name.length; i++) {
            final.push(tabt[i]);
            final.push(tab[i]);
        }
        return final
    }

    function make_json() {
        let json = new Object();

        for (var i in props.name)
            json[props.name[i]] = handl[i]
        json.id = sessionStorage.getItem("id")
        json.actionId = props.actionId
        console.log(json)

        return json
    }

    function post_param() {
        jsonfinal = make_json()
        axios.post(`http://onearea.online:3000/reaction/${props.actionName}`, jsonfinal
        ).then(resa => console.log(resa))
    }


    return (
        <div className='widget-reac'>
            {create_front()}
            <button onClick={post_param} type="submit">Save</button>
        </div>
    );
}