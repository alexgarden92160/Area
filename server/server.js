const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

const db = mysql.createPool({
    user: 'root',
    password: 'password',
    database: 'area',
    insecureAuth: true
});

app.use(bodyParser.json());
app.use(cors())

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
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



app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const checkUsername = "select id from user where username=?";

    db.query(checkUsername, [username], (err, result) => {
        if (err) {
            res.status(503).send(err.message);
        }
        else if (result.length >= 1) {
            res.status(409).send(`Username ${username} already used`);
        }
        else {
            const register = "insert into user (username, password) values (?, ?)";

            db.query(register, [username, password], (err, result) => {
                if (err)
                    res.status(503).send(err.message);
                else
                    res.send(result);
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
    res.send("gg ca marche");
})


app.post("/login", (req, res) => {
    const token = req.body.token;
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
