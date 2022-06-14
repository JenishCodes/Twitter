const express = require("express");
const { History } = require("../models/history");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { Friendship } = require("../models/friendship");
const { getUser, getUsers, getTweets } = require("../utils");
const { Favorite } = require("../models/favorite");
const { Setting } = require("../models/settings");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    var data;
    const query = req.query.name_query.replace("@", "");

    if (req.query.deep_search === "true") {
      data = await User.find({
        $or: [
          { account_name: { $regex: new RegExp("^" + query + ".*") } },
          { name: { $regex: new RegExp(query, "i") } },
          { description: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select("name auth_id account_name profile_image_url description")
        .skip(parseInt(req.query.page))
        .limit(10);
    } else {
      data = await User.find({
        $or: [
          { account_name: { $regex: new RegExp("^" + query + ".*") } },
          { name: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select("name auth_id account_name profile_image_url description")
        .skip(parseInt(req.query.page))
        .limit(10);
    }

    res.send({ data, hasMore: data.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await Setting.findOne({ userId: req.query.id });

    res.send({ data: settings });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.put("/settings", async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate(
      { userId: req.query.id },
      { $set: req.body }
    );

    res.send({ data: settings });
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
    } else if (req.query.id) {
      const data = await User.findById(req.query.id);

      res.send({ data });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/isAccountNameAvailable", async function (req, res) {
  try {
    const ans = await User.findOne({ account_name: req.query.account_name });

    res.send({ data: ans ? false : true });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/updateAccountName", async function (req, res) {
  try {
    await User.findByIdAndUpdate(req.query.id, {
      account_name: req.query.account_name,
    });
    res.send({ data: true });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
})

router.get("/tweets/replies", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    var tweets = await Tweet.find({
      author_id: user._id,
      "referenced_tweet.type": "replied_to",
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.page))
      .limit(10);

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

    res.send({ data: tweets, hasMore: tweets.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets/retweets", async function (req, res) {
  try {
    const user = await User.findOne({
      account_name: req.query.account_name,
    }).select("_id");

    const retweets = await Tweet.find({
      author_id: user._id,
      "referenced_tweet.type": "retweet_of",
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.page))
      .limit(10)
      .select("referenced_tweet -_id")
      .populate("referenced_tweet.id")
      .transform(function (docs) {
        return docs.map((doc) => {
          const { referenced_tweet } = doc._doc;
          const ref = referenced_tweet[referenced_tweet.length - 1];
          return { type: ref.type, ...ref.id._doc };
        });
      });

    const result = await Promise.all(
      retweets.map(async (reference) => {
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

    res.send({ data: result, hasMore: result.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/bookmarks", async function (req, res) {
  try {
    const user = await User.findById(req.query.id);

    const tweets = await getTweets(
      user.bookmarks.slice(
        parseInt(req.query.page),
        parseInt(req.query.page) + 10
      )
    );

    res.send({ data: tweets, hasMore: tweets.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets/mentions", async function (req, res) {
  try {
    const mentioned_tweets = await Tweet.find({
      "entities.mentions.account_name": req.query.account_name,
    })
      .populate("author_id")
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.page))
      .limit(10)
      .transform((docs) => {
        return docs.map((doc) => {
          const { author_id, ...restDoc } = doc._doc;
          return { ...restDoc, author: author_id };
        });
      });

    res.send({
      data: mentioned_tweets,
      hasMore: mentioned_tweets.length === 10,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/tweets", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    const tweets = await Tweet.find({
      author_id: user._id,
      referenced_tweet: [],
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.page))
      .limit(10);

    const data = tweets.map((tweet) => {
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

    res.send({ data, hasMore: data.length === 10 });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/feed", async function (req, res) {
  try {
    const user = await User.findOne({ account_name: req.query.account_name });

    const followings = await Friendship.find({
      followed_by: user._id,
    })
      .select({ following: 1, _id: 0 })
      .populate("following")
      .transform(function (docs) {
        return docs.map((doc) => {
          return {
            _id: doc.following._id,
            account_name: doc.following.account_name,
          };
        });
      });

    const accountNames = [
      user.account_name,
      ...followings.map((following) => following.account_name),
    ];
    const following_ids = [
      user._id,
      ...followings.map((following) => following._id),
    ];

    const tweets = await Tweet.find({
      author_id: { $in: following_ids },
      referenced_tweet: [],
    })
      .select({ createdAt: 1 })
      .transform(function (docs) {
        return docs.map((doc) => {
          return { ...doc._doc, message: "" };
        });
      });
    const retweets = await Tweet.find({
      author_id: { $in: following_ids },
      "referenced_tweet.type": "retweet_of",
    })
      .select({ createdAt: 1, referenced_tweet: 1, author_id: 1 })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { referenced_tweet, author_id, ...restDoc } = doc._doc;
          const ref = referenced_tweet[referenced_tweet.length - 1];
          return {
            _id: ref.id,
            ...restDoc,
            message:
              author_id === user._id
                ? ""
                : accountNames[
                    following_ids.findIndex(
                      (id) => id.toString() === author_id.toString()
                    )
                  ] + " Retweeted",
          };
        });
      });

    const replies = await Tweet.find({
      author_id: { $in: following_ids },
      "referenced_tweet.type": "replied_to",
    })
      .select({ createdAt: 1, referenced_tweet: 1, author_id: 1 })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { referenced_tweet, ...restDoc } = doc._doc;
          const refIds = referenced_tweet.map((ref) => ref.id);
          return {
            _id: restDoc._id,
            ref_tweet_ids: refIds,
            createdAt: restDoc.createdAt,
            message: "",
          };
        });
      });

    const liked_tweets = await Favorite.find({
      author_id: { $in: following_ids },
    })
      .select({ tweet_id: 1, createdAt: 1, _id: 0, author_id: 1 })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { tweet_id, author_id, ...restDoc } = doc._doc;
          return {
            _id: tweet_id,
            ...restDoc,
            message:
              author_id === user._id
                ? ""
                : accountNames[
                    following_ids.findIndex(
                      (id) => id.toString() === author_id.toString()
                    )
                  ] + " Liked",
          };
        });
      });

    const mentioned_tweets = await Tweet.find({
      "entities.mentions.account_name": { $in: accountNames },
    })
      .select({ createdAt: 1, entities: 1 })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { entities, ...restDoc } = doc._doc;
          return {
            ...restDoc,
            message: entities.mentions.find(
              (mention) => mention.account_name === user.account_name
            )
              ? "You are mentioned"
              : entities.mentions[0].account_name + " is mentioned",
          };
        });
      });

    const all_tweets = [
      ...tweets,
      ...retweets,
      ...replies,
      ...liked_tweets,
      ...mentioned_tweets,
    ];

    all_tweets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const unique_tweets = [];

    all_tweets.forEach((tweet, index, self) => {
      var ind = true;
      for (var i = 0; i < self.length; i++) {
        if (i !== index) {
          if (self[i]._id.toString() === tweet._id.toString()) {
            if (self[i].ref_tweet_ids) {
              ind = false;
              break;
            } else if (tweet.ref_tweet_ids) {
              continue;
            } else if (index > i) {
              continue;
            } else {
              ind = false;
              break;
            }
          } else if (self[i].ref_tweet_ids) {
            if (
              self[i].ref_tweet_ids.find(
                (ref_tweet_id) =>
                  ref_tweet_id.toString() === tweet._id.toString()
              )
            ) {
              ind = false;
              break;
            }
          }
        }
      }

      if (ind) {
        unique_tweets.push(tweet);
      }
    });

    const pagedTweets = unique_tweets.slice(
      parseInt(req.query.page),
      parseInt(req.query.page) + 10
    );

    const ids = pagedTweets.map((tweet) => tweet._id);
    const ref_ids = [];

    pagedTweets.forEach((obj) => {
      if (obj.ref_tweet_ids) ref_ids.push(...obj.ref_tweet_ids);
    });

    var ref_tweets = await Tweet.find({ _id: { $in: ref_ids } })
      .populate("author_id", {
        name: 1,
        account_name: 1,
        auth_id: 1,
        profile_image_url: 1,
      })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { author_id, ...restDoc } = doc._doc;
          return {
            ...restDoc,
            author: author_id,
          };
        });
      });

    var final_tweets = await Tweet.find({ _id: { $in: ids } })
      .populate("author_id", {
        name: 1,
        account_name: 1,
        auth_id: 1,
        profile_image_url: 1,
      })
      .transform(function (docs) {
        return docs.map((doc) => {
          const { author_id, ...restDoc } = doc._doc;
          return {
            ...restDoc,
            author: author_id,
          };
        });
      });

    var response = pagedTweets.map((obj) => {
      var tweet = final_tweets.find(
        (t) => t._id.toString() === obj._id.toString()
      );
      var ref_tweet = obj.ref_tweet_ids?.map((id) =>
        ref_tweets.find((t) => t._id.toString() === id.toString())
      );

      return { ...tweet, referenced_tweet: ref_tweet, message: obj.message };
    });

    res.send({ data: response, hasMore: pagedTweets.length === 10 });
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
    const user = await User.create(req.body);

    await Setting.create({ userId: user._id, userName: user.account_name });

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
    console.log(err);
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
