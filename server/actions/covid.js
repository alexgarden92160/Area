const axios = require('axios');

let covid = {};

covid.check_new_case = async (country, value, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.covid19api.com/summary');
        var element = response.data.Countries.find(element => element.Country === country).NewConfirmed;

        switch (symbol) {
            case '=':
                if (element === parseInt(value))
                    status = true;
                break;
            case '>':
                if (element > parseInt(value))
                    status = true;
                break;
            case '<':
                if (element < parseInt(value))
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

covid.check_new_death = async (country, value, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.covid19api.com/summary');
        var element = response.data.Countries.find(element => element.Country === country).NewDeaths;

        switch (symbol) {
            case '=':
                if (element === parseInt(value))
                    status = true;
                break;
            case '>':
                if (element > parseInt(value))
                    status = true;
                break;
            case '<':
                if (element < parseInt(value))
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

covid.check_new_recovered = async (country, value, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.covid19api.com/summary');
        var element = response.data.Countries.find(element => element.Country === country).NewRecovered;

        switch (symbol) {
            case '=':
                if (element === parseInt(value))
                    status = true;
                break;
            case '>':
                if (element > parseInt(value))
                    status = true;
                break;
            case '<':
                if (element < parseInt(value))
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

module.exports = covid;