const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const tweets = require("./routes/tweets");
const hashtags = require("./routes/hashtags");
const favorites = require("./routes/favorites");
const friendships = require("./routes/friendships");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/twitter-clone",
  )
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.log(err));

app.use("/user", users);
app.use("/tweet", tweets);
app.use("/hashtag", hashtags);
app.use("/favorite", favorites);
app.use("/friendship", friendships);

app.listen(process.env.PORT || 3001, () => console.log("Server running on port 3001..."));
