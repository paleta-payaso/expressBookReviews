
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const privateKey = require('./router/auth_users.js').privateKey;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization === undefined) {
        return res.status(400).json({"message": "user not logged in"});
    }

    const token = req.session.authorization["token"];

    jwt.verify(token, privateKey, (err, decode) => {
        if (err) {
            return res.status(400).json({"message": "invalid token"});
        }
    });

    next();
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
