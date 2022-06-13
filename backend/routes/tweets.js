const express = require("express");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { getTweets, getTweet } = require("../utils");
const { Types } = require("mongoose");
const { Favorite } = require("../models/favorite");
const { Hashtag } = require("../models/hashtag");
const { Setting } = require("../models/settings");
const { Notification } = require("../models/notification");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    const results = await Tweet.find({
      text: {
        $regex: new RegExp(req.query.search_query, "i"),
      },
      "referenced_tweet.type": { $ne: "retweet" },
    })
      .skip(req.query.page)
      .limit(10)
      .select({ _id: 1 });

    const data = await getTweets(results.map((result) => result._id));

    res.send({ data, hasMore: data.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/metrics/:field", async function (req, res) {
  try {
    await Tweet.findByIdAndUpdate(req.query.id, {
      $inc: { [req.params.field]: 1 },
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/metrics/profile_visits", async function (req, res) {
  try {
    await Tweet.findByIdAndUpdate(req.query.id, {
      $inc: { "private_metrics.profile_visits": 1 },
    });
    res.sendStatus(200);
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
    console.log(err);
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
    const { replyTo, ...data } = req.body;

    const tweet = await Tweet.create(data);

    if (tweet.entities.hashtags.length > 0) {
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
    }

    const author = await User.findById(data.author_id);

    if (tweet.entities.mentions.length > 0) {
      await Promise.all(
        tweet.entities.mentions.map(async (mention) => {
          const user = await Setting.findOne({
            userName: mention.account_name,
          });

          if (user && user.mentionNotification) {
            Notification.create({
              message: `${author.account_name} mentioned you in a tweet`,
              user: user.userId,
              read: false,
              action: "/" + author.account_name + "/status/" + tweet._id,
            });
          }
        })
      );
    }

    if (req.body.referenced_tweet) {
      const referenced_tweet =
        req.body.referenced_tweet[req.body.referenced_tweet.length - 1];

      if (referenced_tweet.type === "replied_to") {
        await Tweet.findByIdAndUpdate(referenced_tweet.id, {
          $inc: { "public_metrics.reply_count": 1 },
        });

        const user = await Setting.findOne({ userName: replyTo });

        if (user && user.replyNotification) {
          Notification.create({
            message: `${author.account_name} replied to your tweet`,
            user: user.userId,
            read: false,
            action: "/" + author.account_name + "/status/" + tweet._id,
          });
        }
      } else {
        await Tweet.findByIdAndUpdate(referenced_tweet.id, {
          $inc: { "public_metrics.retweet_count": 1 },
        });
      }
    }

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
    var userReplies = [];
    if (req.query.page === 0) {
      userReplies = await Tweet.find({
        author_id: req.query.user_id,
        "referenced_tweet.type": "replied_to",
        "referenced_tweet.id": req.query.id,
      })
        .sort({ createdAt: -1 })
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
    }

    const replies = await Tweet.find({
      user_id: { $ne: req.query.user_id },
      "referenced_tweet.type": "replied_to",
      "referenced_tweet.id": req.query.id,
    })
      .sort({ createdAt: -1 })
      .skip(req.query.page)
      .limit(10)
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

    res.send({ data: [...userReplies, ...replies] });
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
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/isRetweeter", async function (req, res) {
  try {
    const tweet = await Tweet.findOne({
      author_id: Types.ObjectId(req.query.user_id),
      "referenced_tweet.type": "retweet_of",
      "referenced_tweet.id": Types.ObjectId(req.query.tweet_id),
    });

    res.send({ data: tweet ? true : false });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/retweeters", async function (req, res) {
  try {
    const retweeters = await Tweet.find({
      "referenced_tweet.type": "retweet_of",
      "referenced_tweet.id": req.query.id,
    })
      .skip(parseInt(req.query.page))
      .limit(10)
      .populate("author_id")
      .transform((docs) => docs.map((doc) => doc._doc.author_id));

    var users = retweeters.map((retweeter) => {
      return {
        _id: retweeter._id,
        account_name: retweeter.account_name,
        profile_image_url: retweeter.profile_image_url,
        name: retweeter.name,
        description: retweeter.description,
        auth_id: retweeter.auth_id,
        entities: retweeter.entities,
      };
    });

    res.send({ data: users });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
