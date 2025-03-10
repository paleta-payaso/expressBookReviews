
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
public_users.get('/', async (req, res) => {
    try {
        const getBooks = async () => books; // Simulating an async function
        const bookList = await getBooks();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).send("Error retrieving books");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const getBookByISBN = async (isbn) => books[isbn]; // Simulating an async function
        const isbn = req.params.isbn;
        const book = await getBookByISBN(isbn);

        if (book) {
            res.send(JSON.stringify(book, null, 4));
        } else {
            res.send(JSON.stringify({ "message": "no match found", "isbn": isbn }, null, 4));
        }
    } catch (error) {
        res.status(500).send("Error retrieving book details");
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const getBooksByAuthor = async (author) => {
            let bookDetails = Object.values(books);
            return bookDetails.filter((book) => book.author === author);
        };

        const author = req.params.author;
        const bookDetails = await getBooksByAuthor(author);

        if (bookDetails.length > 0) {
            res.send(JSON.stringify(bookDetails, null, 4));
        } else {
            res.send(JSON.stringify({ "message": "no match found", "author": author }, null, 4));
        }
    } catch (error) {
        res.status(500).send("Error retrieving books by author");
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const getBooksByTitle = async (title) => {
            let bookDetails = Object.values(books);
            return bookDetails.filter((book) => book.title === title);
        };

        const title = req.params.title;
        const bookDetails = await getBooksByTitle(title);

        if (bookDetails.length > 0) {
            res.send(JSON.stringify(bookDetails, null, 4));
        } else {
            res.send(JSON.stringify({ "message": "no match found", "title": title }, null, 4));
        }
    } catch (error) {
        res.status(500).send("Error retrieving books by title");
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
