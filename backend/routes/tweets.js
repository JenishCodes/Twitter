const express = require("express");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { getTweets, getTweet } = require("../utils");
const { Types } = require("mongoose");
const { Favorite } = require("../models/favorite");
const { Hashtag } = require("../models/hashtag");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    const results = await Tweet.find(
      {
        text: {
          $regex: new RegExp(req.query.search_query, "i"),
        },
        "referenced_tweet.type": { $ne: "retweet" },
      },
      {
        _id: 1,
      }
    )
      .skip(10 * req.query.cursor)
      .limit(10);

    const response = await getTweets(results.map((result) => result._id));

    res.send({ data: response.data });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/show", async function (req, res) {
  try {
    const ans = await getTweet(req.query.id, req.query.include);

    res.send(ans);
  } catch (err) {
    console.log(err.messsage);
    res.status(400);
    res.send(err.message);
  }
});

router.delete("/destroy", async function (req, res) {
  try {
    var tweet;

    if (req.query.author_id) {
      tweet = await Tweet.findOne({
        author_id: req.query.author_id,
        "referenced_tweet.type": "retweet_of",
        "referenced_tweet.id": req.query.id,
      });
    } else {
      tweet = await Tweet.findById(req.query.id);
    }

    if (tweet.referenced_tweet) {
      if (tweet.referenced_tweet.type === "replied_to") {
        await Tweet.findByIdAndUpdate(Types.ObjectId(req.query.id), {
          $inc: { "public_metrics.reply_count": -1 },
        });
      } else {
        await Tweet.findByIdAndUpdate(Types.ObjectId(req.query.id), {
          $inc: { "public_metrics.retweet_count": -1 },
        });
      }
    }

    await Tweet.deleteMany({
      "referenced_tweet.type": "retweet_of",
      "referenced_tweet.id": tweet._id,
    });

    await Favorite.deleteMany({ tweet_id: tweet._id });

    await Promise.all(
      tweet.entities.hashtags.map((hashtag) => {
        Hashtag.updateOne(
          { tag: hashtag.tag },
          {
            $pull: { tweets: tweet._id },
          }
        );
      })
    );

    await Tweet.findByIdAndRemove(tweet._id);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/create", async function (req, res) {
  try {
    if (req.body.referenced_tweet) {
      const referenced_tweet =
        req.body.referenced_tweet[req.body.referenced_tweet.length - 1];

      if (referenced_tweet.type === "replied_to") {
        await Tweet.findByIdAndUpdate(referenced_tweet.id, {
          $inc: { "public_metrics.reply_count": 1 },
        });
      } else {
        await Tweet.findByIdAndUpdate(referenced_tweet.id, {
          $inc: { "public_metrics.retweet_count": 1 },
        });
      }
    }

    const tweet = await Tweet.create(req.body);

    await Promise.all(
      tweet.entities.hashtags.map(async (hashtag) => {
        await Hashtag.updateOne(
          { tag: hashtag.tag },
          {
            tag: hashtag.tag,
            $push: { tweets: tweet._id },
          },
          { upsert: true }
        );
      })
    );

    await User.findByIdAndUpdate(req.body.author_id, {
      $inc: { tweets_count: 1 },
    });

    res.status(200);
    res.send({ id: tweet._id });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.put("/update", async function (req, res) {
  try {
    await Tweet.findByIdAndUpdate(req.query.id, req.body);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.get("/replies", async function (req, res) {
  try {
    const replies = await Tweet.find({
      "referenced_tweet.type": "replied_to",
      "referenced_tweet.id": req.query.id,
    })
      .populate("author_id", {
        name: 1,
        account_name: 1,
        auth_id: 1,
        profile_image_url: 1,
      })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { author_id, ...resDoc } = doc._doc;
          return { ...resDoc, author: author_id };
        });
      });

    res.send({ data: replies });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/references", async function (req, res) {
  try {
    const referenced_tweets = await Tweet.findById(req.query.id)
      .select("referenced_tweet")
      .populate("referenced_tweet.id")
      .transform(function (doc) {
        const { referenced_tweet, ...restDoc } = doc._doc;
        const newRefTweets = referenced_tweet.map((ref) => {
          return { type: ref.type, ...ref.id._doc };
        });
        return newRefTweets;
      });

    const result = await Promise.all(
      referenced_tweets.map(async (reference) => {
        if (reference.author_id) {
          const ref_tweet_author = await User.findById(
            reference.author_id
          ).select("name account_name auth_id profile_image_url");
          return { ...reference, author: ref_tweet_author };
        } else {
          return null;
        }
      })
    );

    res.send({ data: result });
  } catch (err) {
    console.log(err.message);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/retweeters", async function (req, res) {
  try {
    const retweeters = await Tweet.find(
      {
        "referenced_tweet.type": "retweet_of",
        "referenced_tweet.id": req.query.id,
      },
      { author_id: 1, _id: 0 }
    );

    if (req.query.trim_user === "true") {
      res.send({ data: retweeters.map((retweeter) => retweeter.author_id) });
    } else {
      const users = await Promise.all(
        retweeters.map(
          async (retweeter) =>
            await User.findById(retweeter.author_id, {
              name: 1,
              auth_id: 1,
              entities: 1,
              account_name: 1,
              profile_image_url: 1,
              description: 1,
            })
        )
      );

      res.send({ data: users });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
