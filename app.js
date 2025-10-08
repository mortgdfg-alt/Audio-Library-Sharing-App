<<<<<<< HEAD
const 
=======
const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/error", (req, res) => {
  throw new Error("Something went wrong!");
});


app.use(errorHandler);

module.exports = app;
>>>>>>> 40fb9247cb302a17c093c54225ebafc4a5d61b51
