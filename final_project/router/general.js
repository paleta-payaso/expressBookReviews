
const express = require('express');

let books = require("./booksdb.js");
let userExists = require("./auth_users.js").userExists;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({"message": "missing username and/or password"});
    }

    if (userExists(username)) {
        return res.status(400).json({"message": "username already exists"});
    }

    users.push({"username": username, "password": password});
    // console.log(users);

    return res.status(200).json({"message": "user registered!"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(JSON.stringify({"message": "no match found", "isbn": isbn}, null, 4));
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let bookDetails = Object.values(books);
    bookDetails = bookDetails.filter((book) => book.author === author);
    if (bookDetails.length > 0) {
        res.send(JSON.stringify(bookDetails, null, 4));
    } else {
        res.send(JSON.stringify({"message": "no match found", "author": author}, null, 4));
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let bookDetails = Object.values(books);
    bookDetails = bookDetails.filter((book) => book.title === title);
    if (bookDetails.length > 0) {
        res.send(JSON.stringify(bookDetails, null, 4));
    } else {
        res.send(JSON.stringify({"message": "no match found", "title": title}, null, 4));
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify({"isbn": isbn, "title": book.title, "reviews": book.reviews}, null, 4));
    } else {
        res.send(JSON.stringify({"message": "no match found", "isbn": isbn}, null, 4));
    }
});

module.exports.general = public_users;
