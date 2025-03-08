
const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];
const privateKey = "supersecret";

const userExists = (username) => { //returns boolean
    const userSearch = users.filter((user) => user.username === username);
    return (userSearch.length > 0) ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean
    const userSearch = users.filter((user) => user.username === username);
    if (userSearch.lenght < 1) {
        return null;
    }
    const user = userSearch[0];
    return (user.password === password) ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({"message": "missing username and/or password"});
    }

    if (!userExists(username)) {
        return res.status(400).json({"message": "username not found"});
    }

    if (!authenticatedUser(username, password)) {
        return res.status(400).json({"message": "invalid password"});
    }

    let token = jwt.sign({data: password}, privateKey, {expiresIn: 60*60});
    req.session.authorization = { token, username }
    console.log({token, username});

    return res.status(200).json({"message": "login succesful!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization["username"];
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book === undefined) {
        return res.status(400).json({"message": "no book found", "isbn": isbn});
    }

    const review = req.body.review;
    book.reviews[username] = review;

    return res.status(200).json({"message": "review registered succesfully!"});
});

// delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization["username"];
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book === undefined) {
        return res.status(400).json({"message": "no book found", "isbn": isbn});
    }

    delete book.reviews[username];

    return res.status(200).json({"message": "review deleted succesfully!"});
});

module.exports.authenticated = regd_users;
module.exports.userExists = userExists;
module.exports.users = users;
module.exports.privateKey = privateKey;
