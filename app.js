const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const PORT = 3001;
const app = express();

// require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);
app.use((req, res, next) => {
  req.user = {
    _id: "66acf6e434e0bb45cc5c1c9c", // paste the _id of the test user created in the previous step
  };
  next();
});
// Sign In + Sign Up
app.post("/signin", login);
app.post("/signup", createUser);
app.use(auth);
// app.use('/posts', require('./routes/posts'));
//
app.use(express.json());
app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
