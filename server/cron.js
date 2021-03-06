const cron = require('node-cron');
const db = require('./database/mysql.js');
const intra = require('./actions/intra.js');
const weather = require('./actions/weather.js');
const crypto = require('./actions/crypto.js');
const covid = require('./actions/covid.js')
const mailer = require('./service/mailService.js');
const news = require('./actions/news.js')
const google = require('./actions/google.js')

function cronFunc() {
    cron.schedule('* * * * *', () => {
        const login = "select * from user";

        db.query(login, async (err, result) => {
            if (err)
                console.log("CRON error: can't connect to MySql");
            else {
                for (var i in result) {
                    var user = result[i];
                    console.log("user " + user.id);
                    for (var j in JSON.parse(user.actions).actions) {
                        var action = JSON.parse(user.actions).actions[j];
                        switch (action.name) {
                            case "check_remaining_duration":
                                var _status = await intra.check_remaining_duration(JSON.parse(user.services).intra.token, action.project_name, action.time);
                                break;
                            case "check_recent_absence":
                                var _status = await intra.check_recent_absence(JSON.parse(user.services).intra.token);
                                break;
                            case "check_credit":
                                var _status = await intra.check_credit(JSON.parse(user.services).intra.token, action.number, action.symbol)
                                break;
                            case "check_gpa":
                                var _status = await intra.check_gpa(JSON.parse(user.services).intra.token, action.number, action.symbol)
                                break;
                            case "check_temperature":
                                var _status = await weather.check_temperature(action.city, action.threshold, action.symbol);
                                break;
                            case "check_humidity":
                                var _status = await weather.check_humidity(action.city, action.threshold, action.symbol);
                                break;
                            case "check_crypto_value":
                                var _status = await crypto.check_crypto_value(action.crypto, action.value, action.symbol);
                                break;
                            case "check_new_case":
                                var _status = await covid.check_new_case(action.country, action.value, action.symbol);
                                break;
                            case "check_new_death":
                                var _status = await covid.check_new_death(action.country, action.value, action.symbol);
                                break;
                            case "check_new_recovered":
                                var _status = await covid.check_new_recovered(action.country, action.value, action.symbol);
                                break;
                            case "check_last_news":
                                var _status = await news.check_last_news(action.word);
                                break;
                            case "check_new_comment":
                                var _status = await google.check_new_comment(JSON.parse(user.services).google.token, action.video);
                                break;
                            case "check_new_video":
                                var _status = await google.check_new_video(action.channel);
                                break;
                        }
                        console.log("\t" + action.name + " : " + _status);
                        if (_status)
                            for (var k in action.reactions) {
                                var reaction = action.reactions[k];
                                switch (reaction.name) {
                                    case "send_mail":
                                        await mailer.sendEmail(reaction.email, "Message from " + action.name
                                            + ": " + reaction.message);
                                        break;
                                    case "new_calendar_event":
                                        await google.new_calendar_event(JSON.parse(user.services).google.token, reaction.title,
                                            reaction.location, reaction.description, reaction.time)
                                        break;

                                }
                                console.log("\t=> running " + reaction.name)
                            }
                    }
                }
            }
        })
    });
}

module.exports = cronFunc;