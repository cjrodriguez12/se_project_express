const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const PORT = 3000;
const app = express();
const { login, createUser } = require("./controllers/users");
const mainRouter = require("./routes/index");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Helmet
app.use(helmet());
// CORS headers
app.use(cors());
// Sign In + Sign Up
app.post("/signup", createUser);
app.post("/signin", login);
app.get("/items");
// AUTH
app.use("/", mainRouter);
// app.use('/posts', require('./routes/posts'));
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
