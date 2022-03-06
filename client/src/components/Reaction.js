import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import about from "../about.json"
import axios from "axios";

export default function Reaction(props) {

    let handle = []

    function create_front() {
        let tab = []
        let tabt = []
        let final = []
        let j = 0;

        props.type.map((z) => {
            tab.push(<input onChange={(e) => handle[j] = e.target.value} />);
            handle.push("")
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
            json[props.name[i]] = handle[i]
        json.id = sessionStorage.getItem("id")
        json.actionId = props.actionId
        console.log(json)

        return json
    }

    function post_param() {

        axios.post(`http://onearea.online:3000/reaction/${props.actionName}`,
            make_json
        ).then(resa => console.log(resa))
    }


    return (
        <div className='widget'>
            {create_front()}
            <button onClick={post_param} type="submit">Save</button>
        </div>
    );
}