const express = require("express");
const { Types } = require("mongoose");
const { Favorite } = require("../models/favorite");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { getUsers, getTweets, getUser } = require("../utils");

const router = express.Router();

router.get("/tweet", async function (req, res) {
  const favorites = await Favorite.find(
    { tweet_id: Types.ObjectId(req.query.id) },
    { author_id: 1, _id: 0 }
  );

  var users = favorites.map((favorite) => favorite.author_id);

  if (req.query.trim_user !== "true") {
    const ans = await getUsers(users);

    users = ans.data;
  }

  res.send({ data: users });
});

router.get("/user", async function (req, res) {
  const user = await getUser(req.query.account_name, "account_name");

  const favorites = await Favorite.find(
    { author_id: user.data._id },
    { tweet_id: 1, _id: 0 }
  );

  const tweet_ids = favorites.map((favorite) => favorite.tweet_id);

  const tweets = await getTweets(tweet_ids);

  res.send({ data: tweets.data });
});

router.post("/", async function (req, res) {
  try {
    await Favorite.create(req.body);

    await Tweet.findByIdAndUpdate(req.body.tweet_id, {
      $inc: { "public_metrics.like_count": 1 },
    });

    await User.findByIdAndUpdate(req.body.user_id, {
      $inc: { favourites_count: 1 },
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.delete("/", async function (req, res) {
  try {
    await Favorite.findOneAndRemove({
      author_id: req.query.author_id,
      tweet_id: req.query.tweet_id,
    });

    await Tweet.findByIdAndUpdate(req.query.tweet_id, {
      $inc: { "public_metrics.like_count": -1 },
    });

    await User.findByIdAndUpdate(req.body.user_id, {
      $inc: { favourites_count: -1 },
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

module.exports = router;
