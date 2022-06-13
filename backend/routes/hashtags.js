const express = require("express");
const { Hashtag } = require("../models/hashtag");
const { getTweets } = require("../utils");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    var data;

    if (req.query.tag_query.charAt(0) === "#") {
      data = await Hashtag.find({
        tag: {
          $regex: new RegExp("^" + req.query.tag_query.slice(1) + ".*", "i"),
        },
      })
        .select({ tag: 1, tweet_count: { $size: "$tweets" } })
        .skip(req.query.page)
        .limit(20);
    } else {
      data = await Hashtag.find(
        {
          tag: { $regex: new RegExp(req.query.tag_query, "i") },
        },
        { tag: 1, _id: 0, tweet_count: { $size: "$tweets" } }
      )
        .select({ tag: 1, tweet_count: { $size: "$tweets" } })
        .skip(req.query.page)
        .limit(20);
    }

    res.send({ data });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets", async function (req, res) {
  try {
    const { tweets: tweets_id } = await Hashtag.findOne(
      { tag: req.query.tag },
      { _id: 0, tweets: 1 }
    );

    const tweets = await getTweets(
      tweets_id.slice(parseInt(req.query.page), parseInt(req.query.page) + 20)
    );

    res.send({ data: tweets, hasMore: tweets.length === 20 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/", async function (req, res) {
  try {
    await Hashtag.create(req.body);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
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
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
