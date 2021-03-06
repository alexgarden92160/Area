const express = require('express');
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const db = require('./database/mysql.js');
const mailer = require("./service/mailService.js");;
const DefaultActions = require('./default_actions.json')
const DefaultServices = require('./default_services.json');
const https = require('https');
const path = require('path');
const fs = require('fs');
const AboutJson = require('./about.json');
const cron = require('./cron.js');
const oauth = require('./oauth/google');
const google = require('./actions/google');

app.use(bodyParser.json());
app.use(cors())

cron();
mailer.init();

/*   -------------------------------    HTTP    -------------------------------   */

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// })

/*   -------------------------------    HTTPS    -------------------------------   */

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'cert', 'HSSL-61f1dbc334b67.key')),
        ca: [
            fs.readFileSync(path.join(__dirname, 'cert', 'AAACertificateServices.crt')),
            fs.readFileSync(path.join(__dirname, 'cert', 'USERTrustRSAAAACA.crt')),
            fs.readFileSync(path.join(__dirname, 'cert', 'SectigoRSADomainValidationSecureServerCA.crt'))
        ],
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'onearea_online.crt'))
    },
    app
);

sslServer.listen(port, () => {
    console.log('Secure server on port 3000')
});

app.get("/", (req, res) => {
    res.send("Server Instance V2");
})

app.get("/test", (req, res) => {
    const login = "select * from user";

    db.query(login, (err, result) => {
        if (err)
            res.status(401).send("Test failed: " + err.message);
        else
            res.send(result);
    })
})

app.get("/test_api", async (req, res) => {
    res.send(await google.new_calendar_event(req.query.token, 'test', 'EpitechPAris', 'test', '2'));
})

/*   -------------------------------    OAUTH    -------------------------------   */

app.get('/oauth', async (req, res) => {
    const id = req.query.state;
    const code = req.query.code;

    console.log({
        'id': id,
        'token auth': code
    });

    res.send(await oauth.getAccesToken(id, code));
})

app.get('/get_oauth_url', (req, res) => {
    res.send(oauth.getUrl(req.query.id));
})

/*   -------------------------------    BASIC LOGIN/REGISTER    -------------------------------   */

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const login = "select id from user where username=? and password=?";

    db.query(login, [username, password], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else if (result.length == 0)
            res.status(401).send(`Username ${username} not found`);
        else
            res.send(result);
    })
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const checkUsername = "select id from user where username=?";

    db.query(checkUsername, [username, password], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else if (result.length >= 1)
            res.status(409).send(`Username ${username} already used`);
        else {
            const register = "insert into user (username, password, services, actions) values (?, ?, ?, ?)";

            db.query(register, [username, password, JSON.stringify(DefaultServices),
                JSON.stringify(DefaultActions)], (err, result) => {
                    if (err)
                        res.status(503).send(err.message);
                    else {
                        const login = "select id from user where username=? and password=?";

                        db.query(login, [username, password], (err, result) => {

                            console.log(result);
                            if (err)
                                res.status(503).send(err.message);
                            else
                                res.status(200).send(result);
                        })
                    }
                })
        }
    })
})

/*   -------------------------------    SERVICE ACTIVE SET/GET    -------------------------------   */

app.post("/service/active/set", (req, res) => {
    const service_name = req.body.service_name;
    const active_state = req.body.active_state;
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].services);
            tmp[service_name].is_active = active_state;
            const setServices = "update user set services=? where id=?";

            db.query(setServices, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.send(result);
            })
        }
    })
})

app.post("/service/active/get", (req, res) => {
    const service_name = req.body.service_name;
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else
            res.status(200).send(JSON.parse(result[0].services)[service_name]);
    })
})

app.post("/service/active/getall", (req, res) => {
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else
            res.send(JSON.parse(result[0].services));
    })
})

/*   -------------------------------    SERVICE TOKEN SET    -------------------------------   */

app.post("/service/token/set", (req, res) => {
    const service_name = req.body.service_name;
    const token = req.body.token;
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].services);
            tmp[service_name].token = token;
            const setServices = "update user set services=? where id=?";

            db.query(setServices, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send('OK');
            })
        }
    })
})

/*   -------------------------------    ACTION GET    -------------------------------   */

app.post("/action/getall", (req, res) => {
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else
            res.send(JSON.parse(result[0].actions));
    })
})

/*   -------------------------------    ACTION WEATHER    -------------------------------   */

app.post("/action/check_temperature", (req, res) => {
    const city = req.body.city;
    const threshold = req.body.threshold;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_temperature", "city": city, "threshold": threshold, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_humidity", (req, res) => {
    const city = req.body.city;
    const threshold = req.body.threshold;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_humidity", "city": city, "threshold": threshold, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION CRYTPO    -------------------------------   */

app.post("/action/check_crypto_value", (req, res) => {
    const crypto = req.body.crypto;
    const value = req.body.value;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_crypto_value", "crypto": crypto, "value": value, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION INTRA    -------------------------------   */

app.post("/action/check_remaining_duration", (req, res) => {
    const project_name = req.body.project_name;
    const time = req.body.time;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_remaining_duration", "project_name": project_name, "time": time, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_recent_absence", (req, res) => {
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_recent_absence", "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_credit", (req, res) => {
    const number = req.body.number;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_credit", "number": number, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_gpa", (req, res) => {
    const number = req.body.number;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_gpa", "number": number, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION COVID    -------------------------------   */

app.post("/action/check_new_case", (req, res) => {
    const country = req.body.country;
    const value = req.body.value;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_new_case", "country": country, "value": value, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_new_death", (req, res) => {
    const country = req.body.country;
    const value = req.body.value;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_new_death", "country": country, "value": value, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_new_recovered", (req, res) => {
    const country = req.body.country;
    const value = req.body.value;
    const symbol = req.body.symbol;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_new_recovered", "country": country, "value": value, "symbol": symbol, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION GOOGLE    -------------------------------   */


app.post("/action/check_new_comment", (req, res) => {
    const video = req.body.video;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_new_comment", "video": video, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

app.post("/action/check_new_video", (req, res) => {
    const channel = req.body.channel;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_new_video", "channel": channel, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION NEWS    -------------------------------   */

app.post("/action/check_last_news", (req, res) => {
    const word = req.body.word;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var actionId = tmp.actions.length > 0 ? tmp.actions[tmp.actions.length - 1].id + 1 : 0;

            tmp.actions.push({ "id": actionId, "name": "check_last_news", "word": word, "reactions": [] });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId.toString());
            })
        }
    })
})

/*   -------------------------------    REACTION EMAIL    -------------------------------   */

app.post("/reaction/send_mail", (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
    const actionId = req.body.actionId;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var count = 0;

            for (let i = 0; i < tmp.actions.length; i++) {
                if (tmp.actions[i].id === actionId) {
                    count = i;
                    break
                }
            }

            var reactionId = tmp.actions[count].reactions.length > 0 ? tmp.actions[count].reactions[tmp.actions[count].reactions.length - 1].id + 1 : 0;
            tmp.actions[count].reactions.push({ "id": reactionId, "name": "send_mail", "email": email, "message": message });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(reactionId.toString());
            })
        }
    })
})

/*   -------------------------------    REACTION EMAIL    -------------------------------   */

app.post("/reaction/new_calendar_event", (req, res) => {
    const title = req.body.title;
    const location = req.body.location;
    const description = req.body.description;
    const time = req.body.time;
    const actionId = req.body.actionId;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var count = 0;

            for (let i = 0; i < tmp.actions.length; i++) {
                if (tmp.actions[i].id === actionId) {
                    count = i;
                    break
                }
            }

            var reactionId = tmp.actions[count].reactions.length > 0 ? tmp.actions[count].reactions[tmp.actions[count].reactions.length - 1].id + 1 : 0;
            tmp.actions[count].reactions.push({ "id": reactionId, "name": "new_calendar_event", "title": title, "location": location, "description": description, "time": time });
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(reactionId.toString());
            })
        }
    })
})

/*   -------------------------------    ACTION/REACTION REMOVE    -------------------------------   */

app.post("/action/remove", (req, res) => {
    const actionId = req.body.actionId;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var count = 0;

            for (let i = 0; i < tmp.actions.length; i++) {
                if (tmp.actions[i].id === actionId) {
                    count = i;
                    break
                }
            }

            tmp.actions.splice(count, 1);
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(count.toString())
            })
        }
    })
})

app.post("/reaction/remove", (req, res) => {
    const actionId = req.body.actionId;
    const reactionId = req.body.reactionId;
    const id = req.body.id;

    const getActions = "select actions from user where id=?";

    db.query(getActions, [id], (err, result) => {
        if (err)
            res.status(503).send(err.message);
        else {
            var tmp = JSON.parse(result[0].actions);
            var countAction = 0;
            var countReaction = 0;

            for (let i = 0; i < tmp.actions.length; i++) {
                if (tmp.actions[i].id === actionId) {
                    countAction = i;
                    break
                }
            }

            for (let i = 0; i < tmp.actions[countAction].length; i++) {
                if (tmp.actions[countAction].reactions[i].id === reactionId) {
                    countReaction = i;
                    break;
                }
            }

            tmp.actions[countAction].reactions.splice(countReaction, 1);
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(countReaction.toString())
            })
        }
    })
})

app.post("/test-mail", async (req, res) => {
    const email = req.body.email;
    if (email.length > 0) {
        const _status = await mailer.sendEmail(email);
        return res.send(_status);
    }
    return res.status(400).json({ "error": "email not defined" })
})

/*   -------------------------------    ABOUT JSON    -------------------------------   */

app.get("/about.json", (req, res) => {
    res.status(200).send(AboutJson)
})