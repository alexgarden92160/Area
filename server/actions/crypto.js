const axios = require('axios');

let crypto = {};

crypto.check_crypto_value = async (crypto, value, symbol) => {
    var status = false;

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: crypto,
                vs_currencies: 'eur'
            }
        });

        var element = response.data[crypto].eur;

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

module.exports = crypto;