import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import about from "../about.json"
import rea from "../reaction.json"
import axios from "axios";
import Reaction from "./Reaction";

export default function Pattern(props) {

    let handle = []
    let reacti = "";
    const [r, setR] = useState([])
    let tmp = []
    const [ac, setAc] = useState("")

    function compare_type(type, j, handle) {
        let save = []
        if (type === "string")
            return <input onChange={(e) => handle[j] = e.target.value} />
        else if (type === "list") {
            save.push(<option> </option>)
            props.val[j].map((a) => {
                save.push(<option Values={a}>{a}</option>)
            });
            return <select onChange={(e) => handle[j] = e.target.value}>{save}</select>
        }
    }

    function create_front() {
        let tab = []
        let tabt = []
        let final = []
        let j = 0;

        props.type.map((z) => {
            tab.push(compare_type(z, j, handle));
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

    function reaction() {
        let tab = []

        props.reac.map((a) => {
            tab.push(<option Values={a}>{a}</option>)
        });
        return tab
    }

    function make_json() {
        let json = new Object();

        for (var i in props.name)
            json[props.name[i]] = props.val[i]

        return json
    }

    const post_param = async () => {
        await axios.post(`http://onearea.online:3000/action/${props.actionName}`, {
            make_json,
            id: sessionStorage.getItem("id")
        }
        ).then(resa => { setAc(resa.data); console.log(ac) })
    }

    function add_reaction() {
        let retype = []
        let rename = []

        rea.reactions.map((h) => {
            console.log(reacti)
            if (h.name === reacti) {
                console.log(reacti)
                h.parameters.map((z) => {
                    retype.push(z.type)
                    rename.push(z.name)
                })
            }
        })

        tmp.push(<Reaction actionId={ac} actionName={reacti} type={retype} name={rename} />)
        setR(tmp)
        console.log(r)
    }

    return (
        <Draggable>
            <div className='widget'>
                {create_front()}
                <button onClick={post_param} type="submit">Save</button>
                <select onClick={(e) => reacti = e.target.value}>
                    <option> </option>
                    {reaction()}
                </select>
                <button onClick={add_reaction} type="submit">Add Reaction</button>
                <div>{r}</div>
            </div>
        </Draggable>

    );
}