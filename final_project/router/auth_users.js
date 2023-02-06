const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const secret = "fingerprint_customer";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    for(let user of users){
        if(user.username === username){
            return false;
        }
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    for(let user of users){
        if(user.username === username && user.password === password){
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({ username: username}, secret, { expiresIn: "1h" })
    req.session.authorization = { accessToken };
    req.session.username = username;
    return res.send({
        message: "User logged in successfully!",
        accessToken,
        username,
        users
      });
  }
  else{
    return res.status(401).send({
        message: "Invalid username or password"
      });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  const review = req.body.review;
  const username = req.session.username;

  // check if the user has already posted a review for this book
  if (username in book.reviews) {
    book.reviews[username] = review;
  } else {
    book.reviews[username] = review;
  }

  return res.send({ message: "Review added/modified successfully", reviews: book.reviews});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    // check if the book exists
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    const reviews = book.reviews;
    // check if the user has provided a review
    const username = req.session.username;
    if (!username) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    // check if the user has already provided a review for the book
    if (!reviews[username]) {
      return res.status(404).send({ message: "Review not found" });
    }
    // delete the review
    delete reviews[username];
    return res.send({ message: "Review deleted successfully" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;