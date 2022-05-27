const express = require("express");
const { History } = require("../models/history");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { Friendship } = require("../models/friendship");
const { getUser, getUsers, getTweets } = require("../utils");
const { Types } = require("mongoose");
const { Favorite } = require("../models/favorite");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    var results;
    const query = req.query.name_query.replace("@", "");

    if (req.query.deep_search === "true") {
      results = await User.find({
        $or: [
          { account_name: { $regex: new RegExp("^" + query + ".*") } },
          { name: { $regex: new RegExp(query, "i") } },
          { description: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select("name auth_id account_name profile_image_url description")
        .skip(parseInt(req.query.limit) * parseInt(req.query.cursor))
        .limit(parseInt(req.query.limit));
    } else {
      results = await User.find({
        $or: [
          { account_name: { $regex: new RegExp("^" + query + ".*") } },
          { name: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select("name auth_id account_name profile_image_url description")
        .skip(parseInt(req.query.limit) * parseInt(req.query.cursor))
        .limit(parseInt(req.query.limit));
    }

    res.send({ data: results });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/history", async function (req, res) {
  try {
    const history = await History.find({ user_id: req.query.user_id }).sort({
      updatedAt: -1,
    });

    res.send({ data: history });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.post("/history", async function (req, res) {
  try {
    var history = await History.findOne({
      user_id: req.body.user_id,
      title: req.body.title,
    });

    if (history) {
      history.updatedAt = Date.now();
      history.save();
    } else {
      history = new History(req.body);
      history.save();
    }

    res.send({ data: history });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.delete("/history", async function (req, res) {
  try {
    if (req.query.delete_all === "true") {
      await History.deleteMany({ user_id: req.query.id });
    } else {
      await History.findByIdAndRemove(req.query.id);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/show", async function (req, res) {
  try {
    if (req.query.account_name) {
      const ans = await getUser(
        req.query.account_name,
        "account_name",
        req.query.include
      );
      res.send(ans);
    } else if (req.query.user_id) {
      const ans = await getUser(req.query.user_id, "id", req.query.include);
      res.send(ans);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/lookup", async function (req, res) {
  try {
    const ans = getUsers(req.query.ids);

    res.send(ans);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets/replies", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    var tweets = await Tweet.find({
      author_id: user._id,
      "referenced_tweet.type": "replied_to",
    }).sort({ createdAt: -1 });

    tweets = tweets.map((tweet) => {
      return {
        ...tweet._doc,
        author: {
          _id: user._id,
          name: user.name,
          account_name: user.account_name,
          auth_id: user.auth_id,
          profile_image_url: user.profile_image_url,
        },
      };
    });

    res.send({ data: tweets });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets/retweets", async function (req, res) {
  try {
    const user = await getUser(req.query.account_name);

    var tweet_ids = await Tweet.aggregate([
      {
        $match: {
          author_id: user.data._id,
          "referenced_tweet.type": "retweet_of",
        },
      },
      {
        $project: {
          referenced_tweet: "$referenced_tweet.id",
          _id: 0,
        },
      },
    ]);

    const ans = await getTweets(
      tweet_ids.map((tweet_id) => tweet_id.referenced_tweet)
    );

    ans.data.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.send({ data: ans.data });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/bookmarks", async function (req, res) {
  try {
    const user = await User.findById(req.query.user_id);

    const tweets = await getTweets(user.bookmarks);

    res.send({ data: tweets.data });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets/mentions", async function (req, res) {
  try {
    const mentions = await Tweet.find({
      "entities.mentions.account_name": req.query.account_name,
    });

    const authors = await Promise.all(
      mentions.map(async (mention) => {
        return await User.findById(mention.author_id);
      })
    );

    const mentioned_tweet = mentions.map((mention, index) => {
      return { ...mention._doc, author: authors[index] };
    });

    mentioned_tweet.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.send({ data: mentioned_tweet });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    var tweets;

    tweets = await Tweet.find({
      author_id: user._id,
      referenced_tweet: [],
    }).sort({ createdAt: -1 });

    tweets = tweets.map((tweet) => {
      return {
        ...tweet._doc,
        author: {
          _id: user._id,
          name: user.name,
          account_name: user.account_name,
          auth_id: user.auth_id,
          profile_image_url: user.profile_image_url,
        },
      };
    });

    res.send({ data: tweets });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/feed", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    const ids = await Friendship.find({
      follower_id: user._id,
    })
      .select({ following: 1, _id: 0 })
      .transform(function (docs) {
        return docs.map((doc) => doc.following);
      });

    ids.push(user._id);

    const tweets = await Tweet.find({
      author_id: { $in: ids },
    })
      .sort({ createdAt: -1 })
      .select({ createdAt: 1 })
      .skip(req.query.lastTweet || 0)
      .limit(20)
      .transform(function (docs) {
        return docs.map((doc) => {
          return { ...doc._doc, type: "tweet" };
        });
      });

    const liked_tweets = await Favorite.find({
      author_id: { $in: ids },
    })
      .sort({ createdAt: -1 })
      .select({ tweet_id: 1, createdAt: 1, _id: 0 })
      .skip(req.query.lastLikedTweet || 0)
      .limit(20)
      .transform(function (docs) {
        return docs.map((doc) => {
          return { _id: doc.tweet_id, createdAt: doc.createdAt, type: "liked" };
        });
      });

    const mentioned_tweets = await Tweet.find({
      "entities.mentions.account_name": { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .select({ createdAt: 1 })
      .skip(req.query.lastMentionedTweet || 0)
      .limit(20)
      .transform(function (docs) {
        return docs.map((doc) => {
          return { ...doc._doc, type: "mentioned" };
        });
      });

    var lastLikedTweet = 0,
      lastMentionedTweet = 0,
      lastTweet = 0;

    const all_tweets = [...tweets, ...liked_tweets, ...mentioned_tweets];

    all_tweets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const all_tweet_ids = [];

    all_tweets.forEach((tweet) => {
      if (all_tweet_ids.length < 20) {
        if (tweet.type === "liked") {
          lastLikedTweet++;
        } else if (tweet.type === "mentioned") {
          lastMentionedTweet++;
        } else {
          lastTweet++;
        }
        if (all_tweet_ids.indexOf(String(tweet._id)) === -1) {
          all_tweet_ids.push(String(tweet._id));
        }
      }
    });

    all_tweet_ids.forEach((tweet_id) => Types.ObjectId(tweet_id));

    const ans = await getTweets(all_tweet_ids);

    const response = {
      data: ans.data,
      lastLikedTweet: lastLikedTweet + parseInt(req.query.lastLikedTweet),
      lastMentionedTweet:
        lastMentionedTweet + parseInt(req.query.lastMentionedTweet),
      lastTweet: lastTweet + parseInt(req.query.lastTweet),
    };

    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/tweet/unpin", async function (req, res) {
  try {
    await User.findByIdAndUpdate(req.body.user_id, {
      pinned_tweet_id: null,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/tweet/pin", async function (req, res) {
  try {
    await User.findByIdAndUpdate(req.body.user_id, {
      pinned_tweet_id: req.body.tweet_id,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/tweet/bookmark", async function (req, res) {
  try {
    const user = await User.findById(req.body.user_id);

    if (user.bookmarks.includes(req.body.tweet_id)) {
      res.sendStatus(200);
    } else {
      await User.findByIdAndUpdate(req.body.user_id, {
        $push: {
          bookmarks: req.body.tweet_id,
        },
      });

      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/tweet/unbookmark", async function (req, res) {
  try {
    const user = await User.findById(req.body.user_id);

    if (!user.bookmarks.includes(req.body.tweet_id)) {
      res.sendStatus(200);
    } else {
      await User.findByIdAndUpdate(req.body.user_id, {
        $pull: {
          bookmarks: req.body.tweet_id,
        },
      });

      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/", async function (req, res) {
  try {
    await User.create(req.body);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:id", async function (req, res) {
  try {
    await User.findOneAndUpdate({ auth_id: req.params.id }, req.body);
  } catch (err) {
    console.log(err.message);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/tweet/bookmark", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    if (user.bookmarked_tweets.includes(req.body.tweet_id)) {
      user.bookmarked_tweets = user.bookmarked_tweets.filter(
        (id) => id != req.body.tweet_id
      );
    } else {
      user.bookmarked_tweets.push(req.body.tweet_id);
    }

    await user.save();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
