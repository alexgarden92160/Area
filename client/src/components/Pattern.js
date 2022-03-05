import React, { useState } from "react";
import Draggable from 'react-draggable';

export default function Pattern(props) {

    function compare_type(type) {
        if (type === "string")
            return <input />
        else if (type === "list") {

            return <select />
        }
        else if (type === "int")
            return <input />
    }

    function create_front() {
        let tab = []
        let tabt = []
        let final = []

        props.type.map((z) => {
            tab.push(compare_type(z));

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

    return (
        <Draggable>
            <div className='widget'>
                {create_front()}
                <select>
                    <option>Reaction</option>
                </select>
            </div>
        </Draggable>

    );
}