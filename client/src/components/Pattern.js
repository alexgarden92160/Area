import React, { useState } from "react";
import Draggable from 'react-draggable';
import about from "../about.json"

export default function Pattern(props) {

    const [vari, setVari] = useState("")
    let getvari = []

    function compare_type(type, j) {
        let save = []
        if (type === "string")
            return <input />
        else if (type === "list") {
            props.val[j].map((a) => {
                save.push(<option Values={a}>{a}</option>)
            });
            return <select>{save}</select>
        }
    }

    function create_front() {
        let tab = []
        let tabt = []
        let final = []
        let j = 0;

        props.type.map((z) => {
            tab.push(compare_type(z, j));
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

    function add_reaction() {
        let tab = []

        props.reac.map((a) => {
            tab.push(<option Values={a}>{a}</option>)
        });
        return tab
    }

    function save_vari() {

    }

    return (
        <Draggable>
            <div className='widget'>

                {create_front()}
                <select>
                    <option>Reaction</option>
                    {add_reaction()}
                </select>
            </div>
        </Draggable>

    );
}