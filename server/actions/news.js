const axios = require('axios');

let news = {};

news.APIKEY = '67f9dd8879fc47b5a52514e80d6b03c9';

news.check_last_news = async (word) => {
    var status = false;

    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'fr',
                apiKey: news.APIKEY
            }
        });

        const string = response.data.articles[0].title;

        if (string.includes(word))
            status = true;
    } catch (error) {
        console.log(error);
    }

    return status;
}

module.exports = news;