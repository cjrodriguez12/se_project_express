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

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
