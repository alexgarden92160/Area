const axios = require('axios');

let weather = {};

weather.apikey = 'b70c4b6ba2de90aceabdbbb5d36eaf76';

weather.check_humidity = async (city, threshold, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: weather.apikey,
                units: 'metric'
            }
        });

        var element = response.data.main.humidity;

        switch (symbol) {
            case '=':
                if (parseInt(element) === parseInt(threshold))
                    status = true;
                break;
            case '>':
                if (parseInt(element) > parseInt(threshold))
                    status = true;
                break;
            case '<':
                if (parseInt(element) < parseInt(threshold))
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

weather.check_temperature = async (city, threshold, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: weather.apikey,
                units: 'metric'
            }
        });

        var element = response.data.main.temp;

        switch (symbol) {
            case '=':
                if (parseInt(element) === parseInt(threshold))
                    status = true;
                break;
            case '>':
                if (parseInt(element) > parseInt(threshold))
                    status = true;
                break;
            case '<':
                if (parseInt(element) < parseInt(threshold))
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

module.exports = weather;