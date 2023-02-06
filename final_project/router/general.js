const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // get the username and password from the request body
  const { username, password } = req.body;
  // check if the username is already taken
  if (!isValid(username)) {
    return res.status(400).send({ message: "Username already taken" });
  }
  // add the user to the users list
  users.push({ username, password });
  return res.send({
    message: "User registered successfully!",
    users,
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      let booksData = books;
      return res.status(200).json({ booksData });
    } catch (error) {
      return res.status(500).json({ message: "Error getting the books data" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const book = books[isbn];
      if (!book) {
        return res.status(400).json({ message: "Book not found" });
      }
      return res.json({ book });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
});
  
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
      const author = req.params.author.toLowerCase.split(" ").join("");
      for(let book of Object.values(books)){
          let currAuth = book.author.toLowerCase().split(" ").join("");
          if(currAuth === author){
              return res.json(book);
          }
          else{
              return res.status(404).send({message: "Book not found"});
          }
      }
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        const title = req.params.title.toLowerCase.split(" ").join("");
        for(let book of Object.values(books)){
            let currTitle = book.title.toLowerCase().split(" ").join("");
            if(title === currTitle){
                return res.json(book);
            }
            else{
                return res.status(404).send({message: "Book not found"});
            }
        }
        
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
