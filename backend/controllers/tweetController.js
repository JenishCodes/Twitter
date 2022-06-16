const { Setting } = require("../models/setting");
const { Tweet } = require("../models/tweet");
const favoriteController = require("./favoriteController");
const hashtagController = require("./hashtagController");
const notificationController = require("./notificationController");
const userController = require("./userController");
const { ObjectId } = require("mongoose").Types;

exports.searchTweets = async function (query, page) {
  const results = await Tweet.find({
    text: {
      $regex: new RegExp(query, "i"),
    },
    "referenced_tweet.type": { $ne: "retweet" },
  })
    .select({ _id: 1 })
    .skip(page)
    .limit(10)
    .transform((docs) => docs.map((doc) => doc._id));

  const data = await exports.getTweets({ _id: { $in: results } });

  return { data, hasMore: data.length === 10 };
};

exports.deleteTweet = async function (tweet_id, author_id) {
  var tweet;

  if (author_id) {
    tweet = await Tweet.findOne({
      author: ObjectId(author_id),
      "referenced_tweet.type": "retweet_of",
      "referenced_tweet.id": tweet_id,
    });
  } else {
    tweet = await Tweet.findById(tweet_id);
  }

  if (tweet.referenced_tweet) {
    if (tweet.referenced_tweet.type === "replied_to") {
      await Tweet.findByIdAndUpdate(tweet_id, {
        $inc: { "public_metrics.reply_count": -1 },
      });
    } else {
      await Tweet.findByIdAndUpdate(tweet_id, {
        $inc: { "public_metrics.retweet_count": -1 },
      });
    }
  }

  await Tweet.deleteMany({
    "referenced_tweet.type": "retweet_of",
    "referenced_tweet.id": ObjectId(tweet._id),
  });

  await favoriteController.destoryFavorites(tweet._id);

  await Promise.all(
    tweet.entities.hashtags.map(async (hashtag) => {
      await hashtagController.removeTweetFromHashtag(hashtag.tag, tweet._id);
    })
  );

  await Tweet.findByIdAndRemove(tweet._id);

  return true;
};

exports.createTweet = async function (tweetData) {
  const { replyTo, ...data } = tweetData;

  const tweet = new Tweet(data);

  await tweet.save();

  if (tweet.entities.hashtags.length > 0) {
    await Promise.all(
      tweet.entities.hashtags.map(async (hashtag) => {
        await hashtagController.addTweetToHashtag(hashtag.tag, tweet._id);
      })
    );
  }

  const author = await userController.getUser(
    "id",
    data.author,
    "account_name"
  );

  if (tweet.entities.mentions.length > 0) {
    await Promise.all(
      tweet.entities.mentions.map(async (mention) => {
        const user = await Setting.findOne({
          username: mention.account_name,
        });

        if (user && user.mentionNotification) {
          notificationController.createNotification({
            message: `${author.account_name} mentioned you in a tweet`,
            user: user.userId,
            action: "/" + author.account_name + "/status/" + tweet._id,
          });
        }
      })
    );
  }

  if (tweetData.referenced_tweet) {
    const referenced_tweet =
      tweetData.referenced_tweet[tweetData.referenced_tweet.length - 1];

    if (referenced_tweet.type === "replied_to") {
      await Tweet.findByIdAndUpdate(referenced_tweet.id, {
        $inc: { "public_metrics.reply_count": 1 },
      });

      const user = await Setting.findOne({ username: replyTo });

      if (user && user.replyNotification) {
        notificationController.createNotification({
          message: `${author.account_name} replied to your tweet`,
          user: user.userId,
          action: "/" + author.account_name + "/status/" + tweet._id,
        });
      }
    } else {
      await Tweet.findByIdAndUpdate(referenced_tweet.id, {
        $inc: { "public_metrics.retweet_count": 1 },
      });
    }
  }

  await userController.updateUserDetails(data.author, {
    $inc: { tweets_count: 1 },
  });

  return tweet.id;
};

exports.getTweetReplies = async function (tweet_id, user_id, page) {
  var userReplies = [];
  if (page === 0) {
    userReplies = await Tweet.find({
      author: ObjectId(user_id),
      "referenced_tweet.type": "replied_to",
      "referenced_tweet.id": ObjectId(tweet_id),
    })
      .sort({ createdAt: -1 })
      .populate("author", "name account_name auth_id profile_image_url");
  }

  const replies = await Tweet.find({
    author: { $ne: ObjectId(user_id) },
    "referenced_tweet.type": "replied_to",
    "referenced_tweet.id": ObjectId(tweet_id),
  })
    .sort({ createdAt: -1 })
    .skip(page)
    .limit(10)
    .populate("author", "name account_name auth_id profile_image_url");
  console.log([...userReplies, ...replies]);
  return { data: [...userReplies, ...replies], hasMore: replies.length === 10 };
};

exports.getTweetReferences = async function (tweet_id) {
  const referenced_tweets = await Tweet.findById(tweet_id, "referenced_tweet")
    .populate("referenced_tweet.id")
    .transform(function (doc) {
      const { referenced_tweet } = doc._doc;
      const newRefTweets = referenced_tweet.map((ref) => {
        return { type: ref.type, ...ref.id._doc };
      });
      return newRefTweets;
    });

  const data = await Promise.all(
    referenced_tweets.map(async (reference) => {
      if (reference.author) {
        const ref_tweet_author = await userController.getUser(
          reference.author,
          "name account_name auth_id profile_image_url"
        );
        return { ...reference, author: ref_tweet_author };
      } else {
        return null;
      }
    })
  );

  return data;
};

exports.getTweet = async function (tweet_id, fields, include = null) {
  const data = await Tweet.findById(tweet_id, fields)
    .populate("author", "name account_name auth_id profile_image_url")
    .populate(include);

  return data;
};

exports.getTweets = async function (condition, page, fields) {
  var tweets = await Tweet.find(condition)
    .sort({ createdAt: -1 })
    .skip(page)
    .limit(10)
    .populate("author", fields)
    .populate("referenced_tweet.id")
    .transform(function (docs) {
      return docs.map((doc) => {
        const { referenced_tweet, ...restDoc } = doc._doc;
        const newRefTweets = referenced_tweet.map((ref) => {
          return { type: ref.type, ...ref.id._doc };
        });
        return {
          ...restDoc,
          referenced_tweet: newRefTweets,
        };
      });
    });

  const res = await Promise.all(
    tweets.map(async (tweet) => {
      if (tweet.referenced_tweet.length === 0) {
        return tweet;
      } else {
        const { author, ...restRef } =
          tweet.referenced_tweet[tweet.referenced_tweet.length - 1];

        const ref_user = await userController.getUser("id", author, fields);

        const refTweet = { author: ref_user, ...restRef };

        if (restRef.type === "replied_to") {
          return {
            ...tweet,
            referenced_tweet: [refTweet],
          };
        } else {
          return {
            ...refTweet,
            message: tweet.author.account_name + " Retweeted",
          };
        }
      }
    })
  );

  return res;
};

exports.getTweetRetweeters = async function (tweet_id, page) {
  const data = await Tweet.find({
    "referenced_tweet.type": "retweet_of",
    "referenced_tweet.id": ObjectId(tweet_id),
  })
    .skip(parseInt(page))
    .limit(10)
    .populate(
      "author",
      "name account_name auth_id profile_image_url description"
    )
    .transform((docs) => docs.map((doc) => doc._doc.author));

  return { data, hasMore: data.length === 10 };
};

exports.isRetweeter = async function (tweet_id, user_id) {
  const data = await Tweet.findOne({
    author: ObjectId(user_id),
    "referenced_tweet.type": "retweet_of",
    "referenced_tweet.id": ObjectId(tweet_id),
  });

  return data ? true : false;
};

exports.updateTweetDetails = async function (tweet_id, newData) {
  await Tweet.findByIdAndUpdate(tweet_id, newData);

  return true;
};
