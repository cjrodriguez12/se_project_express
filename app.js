const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const PORT = 3001;
const app = express();

// require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);
// Sign In + Sign Up
app.post("/signin", login);
app.post("/signup", createUser);
app.use(auth);
// app.use('/posts', require('./routes/posts'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
