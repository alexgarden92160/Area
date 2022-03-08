const axios = require('axios');
const db = require('../database/mysql.js');

function getUrl(id) {
    const baseUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    const optionsUrl = {
        client_id: '171093942489-7pe0ilftvscuv5runqumdoab1la5c4la.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/oauth',
        response_type: 'code',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/youtube'
        ].join(' '),
        state: id
    }

    baseUrl.search = new URLSearchParams(optionsUrl);

    return baseUrl;
}

async function getAccesToken(id, code) {
    var accessToken = '';
    const baseUrl = ('https://oauth2.googleapis.com/token');

    const optionsUrl = new URLSearchParams ({
        code: code,
        client_id: '171093942489-7pe0ilftvscuv5runqumdoab1la5c4la.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost/oauth',
        grant_type: 'authorization_code'
    });

    accessToken = await axios.post(baseUrl, optionsUrl, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then(function (response) {
        const getServices = "select services from user where id=?";

        db.query(getServices, [id], (err, result) => {
            if (err)
                console.log(err);
            else {
                var tmp = JSON.parse(result[0].services);
                tmp['google'].token = response.data.access_token;
                const setServices = "update user set services=? where id=?";

                db.query(setServices, [JSON.stringify(tmp), id], (err, result) => {
                    if (err)
                        console.log(err.message);
                    else
                        console.log('OK');
                })
            }
        })
    });
}

module.exports = { getUrl, getAccesToken };