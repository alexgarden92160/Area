const cron = require('node-cron');
const db = require('./database/mysql.js');
const intra = require('./actions/intra.js');
const mailer = require('./service/mailService.js');

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
                                break;
                            case "check_temperature":
                                break;
                            case "check_crypto_value":
                                break;
                            case "check_new_comment":
                                break;
                            case "check_new_video":
                                break;
                            case "check_likes":
                                break;
                        }
                        console.log("\t" + action.name + " : " + _status);
                        if (_status)
                            for (var k in action.reactions) {
                                var reaction = action.reactions[k];
                                switch (reaction.name) {
                                    case "send_mail":
                                        console.log("normalement ca devrait envoyer un email");
                                        await mailer.sendEmail(reaction.email, reaction.message);
                                        break;
                                    case "reply_to_comment":
                                        break;
                                    case "delete_comment":
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