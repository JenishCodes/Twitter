const express = require("express");
const { Types } = require("mongoose");
const { Favorite } = require("../models/favorite");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { getUsers, getTweets, getUser } = require("../utils");

const router = express.Router();

router.get("/isFavoriter", async function (req, res) {
  try {
    const favoriter = await Favorite.findOne({
      author_id: Types.ObjectId(req.query.user_id),
      tweet_id: Types.ObjectId(req.query.tweet_id),
    });

    if (favoriter) {
      res.send({ data: true });
    } else {
      res.send({ data: false });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/favoriters", async function (req, res) {
  const favoriters = await Favorite.find(
    { tweet_id: Types.ObjectId(req.query.id) },
    { author_id: 1, _id: 0 }
  )
    .skip(req.query.page)
    .limit(10)
    .populate("author_id")
    .transform((docs) => docs.map((doc) => doc._doc.author_id));

  var users = favoriters.map((favoriter) => {
    return {
      _id: favoriter._id,
      account_name: favoriter.account_name,
      profile_image_url: favoriter.profile_image_url,
      name: favoriter.name,
      description: favoriter.description,
      auth_id: favoriter.auth_id,
      entities: favoriter.entities,
    };
  });

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

  res.send({ data: tweets });
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
