const express = require("express");
const { User } = require("../models/user");

const router = express.Router();

router.get("verify_credentials", async function (req, res) {
  const user = await User.aggregate([
    {
      $lookup: {
        from: "Tweet",
        localField: "pinned_tweet_id",
        foreignField: "_id",
        as: "pinned_tweet",
      },
    },
  ]).findById(req.query.username);
    
    res.send(user)
});
