const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const mailer = require("./service/mailService.js");
const DefaultActions = require('./default_actions.json')
const DefaultServices = require('./default_services.json')
const AboutJson = require('./about.json')

const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'area'
});

app.use(bodyParser.json());
app.use(cors())
mailer.init();

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})

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

    const checkUsername = "select id from user where username=? and password =?";

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

            tmp.actions.push({"id": actionId, "name": "check_temperature", "city": city, "threshold": threshold, "symbol": symbol, "reactions": []})
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId);
            })
        }
    })
})

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

            tmp.actions.push({"id": actionId, "name": "check_remaining_duration", "project_name": project_name, "time": time, "reactions": []})
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(actionId);
            })
        }
    })
})

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

            var reactionId = tmp.actions[count].reactions.length > 0 ? tmp.actions[count].reactions[tmp.actions[count].reactions.length].id + 1 : 0;
            tmp.actions[count].reactions.push({"id": reactionId, "name": "send_mail", "email": email, "message": message});
            const setActions = "update user set actions=? where id=?";

            db.query(setActions, [JSON.stringify(tmp), id], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.status(200).send(reactionId);
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

app.get("/about.json", (req, res) => {
    res.status(200).send(AboutJson)
})