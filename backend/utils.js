const { Tweet } = require("./models/tweet");
const { User } = require("./models/user");

exports.getUser = async function getUser(field, type, include) {
  var user = null;

  if (type === "account_name") {
    user = await User.findOne({ account_name: field });
  } else if (type === "id") {
    user = await User.findById(field);
  }

  if (include === "pinned_tweet_id") {
    if (user.pinned_tweet_id) {
      const tweet = await Tweet.findById(user.pinned_tweet_id);
      return { data: user, includes: { pinned_tweet: tweet } };
    } else {
      return { data: user, includes: { pinned_tweet: null } };
    }
  } else {
    return { data: user };
  }
};

exports.getUsers = async function getUsers(ids) {
  const users = await User.find({ _id: { $in: ids } });
  return { data: users };
};

exports.getTweet = async function getTweet(id, include) {
  var tweet = await Tweet.findById(id);

  if (tweet) {
    const author = await User.findById(tweet.author_id, {
      name: 1,
      account_name: 1,
      auth_id: 1,
      profile_image_url: 1,
    });

    tweet = { ...tweet._doc, author };

    if (include === "referenced_tweet.id") {
      const refTweet = await Tweet.findById(tweet.referenced_tweet.id);

      return { data: tweet, includes: { tweet: refTweet } };
    }
  }

  return { data: tweet };
};

exports.getTweets = async function getTweets(ids) {
  var tweets = await Tweet.find({ _id: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate("author_id", {
      name: 1,
      account_name: 1,
      auth_id: 1,
      profile_image_url: 1,
    })
    .populate("referenced_tweet.id")
    .transform(function (docs) {
      return docs.map((doc) => {
        const { author_id, referenced_tweet, ...restDoc } = doc._doc;
        const newRefTweets = referenced_tweet.map((ref) => {
          return { type: ref.type, ...ref.id._doc };
        });
        return {
          ...restDoc,
          author: author_id,
          referenced_tweet: newRefTweets,
        };
      });
    });

  const res = await Promise.all(
    tweets.map(async (tweet) => {
      if (tweet.referenced_tweet.length === 0) {
        return tweet;
      } else {
        const { author_id, ...restRef } =
          tweet.referenced_tweet[tweet.referenced_tweet.length - 1];

        const ref_user = await User.findById(author_id).select(
          "name account_name auth_id profile_image_url"
        );

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
