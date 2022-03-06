const cron = require('node-cron');
const db = require('./database/mysql.js');
const intra = require('./actions/intra.js');

function cronFunc() {
    cron.schedule('* * * * *', () => {
        const login = "select * from user";

        db.query(login, async (err, result) => {
            if (err)
                console.log("CRON error: can't connect to MySql");
            else {
                for (var i in result) {
                    var user = result[i];
                    for (var j in JSON.parse(user.actions).actions) {
                        var action = JSON.parse(user.actions).actions[j];
                        switch (action.name) {
                            case "check_remaining_duration":
                                var _status = await intra.check_remaining_duration(JSON.parse(user.services).intra.token, action.project_name, action.time);
                                console.log("user " + user.id + " check_remaining_duration : " + _status);
                                break;
                        }
                    }
                }
            }
        })
    });
}

module.exports = cronFunc;