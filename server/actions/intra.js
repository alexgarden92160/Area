const axios = require('axios');

let intra = {};

intra.check_remaining_duration = async (token, project_name, time) => {
    var status = false;

    try {
        const response = await axios.get(token + '/?format=json');
        var element = response.data.board.projets.find(element => element.title === project_name).timeline_barre;

        if (parseInt(element) > parseInt(time))
            status = true;
    } catch (error) {
        console.log(error);
    }

    return status;
}

intra.check_gpa = async (token, number, symbol) => {
    var status = false;

    try {
        const response = await axios.get(token + '/user/?format=json');
        var element = response.data.gpa[0].gpa;

        switch (symbol) {
            case '=':
                if (parseInt(element) === parseInt(number))
                    status = true;
                break;
            case '>':
                if (parseInt(element) > parseInt(number))
                    status = true;
                break;
            case '<':
                if (parseInt(element) < parseInt(number))
                    status = true;
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }

    return status;
}

intra.check_credit = async (token, number, symbol) => {
    var status = false;

    try {
        const response = await axios.get(token + '/user/?format=json');
        var element = response.data.credits;

        switch (symbol) {
            case '=':
                if (element === parseInt(number))
                    status = true;
                break;
            case '>':
                if (element > parseInt(number))
                    status = true;
                break;
            case '<':
                if (element < parseInt(number))
                    status = true;
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }

    return status;
}

intra.check_recent_absence = async (token) => {
    var status = false;

    try {
        const response = await axios.get(token + '/user/notification/missed?format=json');
        var element = response.data.recents;

        if (element.length != 0)
            status = true;
    } catch (error) {
        console.log(error);
    }

    return status;
}

module.exports = intra;