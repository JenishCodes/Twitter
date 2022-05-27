const express = require("express");
const { Hashtag } = require("../models/hashtag");
const { getTweets } = require("../utils");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    var results;

    if (req.query.tag_query.charAt(0) === "#") {
      results = await Hashtag.find({
        tag: {
          $regex: new RegExp("^" + req.query.tag_query.slice(1) + ".*", "i"),
        },
      })
        .select({ tag: 1, tweet_count: { $size: "$tweets" } })
        .skip(req.query.limit * req.query.cursor)
        .limit(req.query.limit);
    } else {
      results = await Hashtag.find(
        {
          tag: { $regex: new RegExp(req.query.tag_query, "i") },
        },
        { tag: 1, _id: 0, tweet_count: { $size: "$tweets" } }
      )
        .select({ tag: 1, tweet_count: { $size: "$tweets" } })
        .skip(req.query.limit * req.query.cursor)
        .limit(req.query.limit);
    }

    res.send({ data: results });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets", async function (req, res) {
  try {
    const { tweets: tweets_id } = await Hashtag.findOne(
      { tag: req.query.hashtag },
      { _id: 0, tweets: 1 }
    );

    const tweets = await getTweets(tweets_id);

    res.send(tweets);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/", async function (req, res) {
  try {
    await Hashtag.create(req.body);

    res.send(200);
  } catch (err) {
    console.log(err.messsage);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/", async function (req, res) {
  try {
    await Hashtag.findOneAndUpdate(
      { tag: req.body.tag },
      { $push: { tweets: req.body.tweet } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
