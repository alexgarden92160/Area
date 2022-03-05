const axios = require('axios');
const db = require('../database/mysql.js');

let intra = {};

intra.check_remaining_duration = async (token, project_name, time) => {
    var status = false;

    try {
        const response = await axios.get(token + '/?format=json');
        var element = response.data.board.projets.find(element => element.title === project_name);

        if (parseInt(element.timeline_barre) > time) {
            status = true;
            console.log(element.timeline_barre);
        }
    } catch (error) {
        console.log(error);
    }

    return status;
}

module.exports = intra;