const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const mailer = require("./service/mailService.js");

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

const defaultServices = {
    "weather": {
        "is_active": false
    },
    "youtube": {
        "is_active": false,
        "token": ""
    },
}

const defaultActions = { "actions": [] }

app.get('/testdb', (req, res) => {
    db.query("insert into user (username, password) values ('testuser', 'testmdp')")
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const checkUsername = "select id from user where username=? and password =?";

    db.query(checkUsername, [username, password], (err, result) => {
        if (err) {
            res.status(503).send(err.message);
        }
        else if (result.length >= 1) {
            res.status(409).send(`Username ${username} already used`);
        }
        else {
            const register = "insert into user (username, password, services, actions) values (?, ?, ?, ?)";

            db.query(register, [username, password, JSON.stringify(defaultServices),
                JSON.stringify(defaultActions)], (err, result) => {
                    if (err)
                        res.status(503).send(err.message);
                    else {
                        const login = "select id from user where username=? and password=?";

                        db.query(login, [username, password], (err, result) => {

                            console.log(result);
                            if (err)
                                res.status(503).send(err.message);
                            else
                                res.send(result);
                        })
                    }
                })
        }
    })
})

app.get("/test", (req, res) => {
    const login = "select * from user";

    db.query(login, (err, result) => {
        if (err)
            res.status(401).send("Test failed: " + err.message);
        else {
            res.send(result);
        }
    })
})

app.get("/", (req, res) => {
    res.send("Server Instance V2");
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const login = "select id from user where username=? and password=?";

    db.query(login, [username, password], (err, result) => {

        console.log(result);
        if (err)
            res.status(503).send(err.message);
        else if (result.length == 0)
            res.status(401).send(`Username ${username} not found`);
        else
            res.send(result);
    })
})

app.post("/service/active/set", (req, res) => {
    const service_name = req.body.service_name;
    const active_state = req.body.active_state;
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err) {
            res.status(503).send(err.message);
        }
        else {
            var tmp = JSON.parse(result);
            tmp[service_name].is_active = active_state;
            const setServices = "update user set services=? where id=?";

            db.query(setServices, [tmp, id], (err, result) => {
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
        if (err) {
            res.status(503).send(err.message);
        }
        else {
            res.send(result[service_name]);
        }
    })
})

app.post("/service/active/getall", (req, res) => {
    const id = req.body.id;

    const getServices = "select services from user where id=?";

    db.query(getServices, [id], (err, result) => {
        if (err) {
            res.status(503).send(err.message);
        }
        else {
            res.send(result);
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