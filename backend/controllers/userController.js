const { Favorite } = require("../models/favorite");
const { Friendship } = require("../models/friendship");
const { History } = require("../models/history");
const { Setting } = require("../models/setting");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const tweetController = require("./tweetController");
const { ObjectId } = require("mongoose").Types;

exports.updateUserDetails = async function (user_id, newData) {
  await User.findByIdAndUpdate(user_id, newData);
};

exports.getUser = async function (key, value, fields, include = null) {
  if (key === "id") {
    const data = await User.findById(value, fields).populate(include);
    return data;
  } else {
    const data = await User.findOne({ [key]: value }, fields).populate(include);
    return data;
  }
};

exports.getUsers = async function (condition) {
  const data = await User.find(condition);

  return data;
};

exports.searchUsers = async function (query, page, limit, deep_search) {
  query = query.replace("@", "");

  const data = await User.find(
    {
      $or: [
        { account_name: { $regex: new RegExp("^" + query + ".*") } },
        { name: { $regex: new RegExp(query, "i") } },
        {
          description: {
            $regex: new RegExp(deep_search === "true" ? query : "@@", "i"),
          },
        },
      ],
    },
    "name auth_id account_name profile_image_url description"
  )
    .skip(parseInt(page))
    .limit(limit);

  return { data, hasMore: data.length === limit };
};

exports.getUserSettings = async function (user_id) {
  const data = await Setting.findOne({ user_id: ObjectId(user_id) });

  return data;
};

exports.updateUserSettings = async function (user_id, newSettings) {
  await Setting.findOneAndUpdate(
    { user_id: ObjectId(user_id) },
    { $set: newSettings }
  );

  return true;
};

exports.getUserHistory = async function (user_id) {
  const data = await History.find({ user_id: ObjectId(user_id) }).sort({
    updatedAt: -1,
  });

  return data;
};

exports.updateUserHistory = async function (user_id, newHistoryData) {
  var data = await History.findOne({
    user_id: ObjectId(user_id),
    title: newHistoryData.title,
  });

  if (data) {
    data.updatedAt = Date.now();
  } else {
    data = new History(newHistoryData);
  }
  data.save();

  return data;
};

exports.deleteUserHistory = async function (user_id, delete_all) {
  if (delete_all === "true") {
    await History.deleteMany({ user_id: ObjectId(user_id) });
  } else {
    await History.findByIdAndDelete(user_id);
  }
  return true;
};

exports.isAccountNameAvailable = async function (account_name) {
  const data = await User.findOne({ account_name });

  return !data;
};

exports.updateAccountName = async function (user_id, account_name) {
  await User.findByIdAndUpdate(user_id, { account_name });

  return true;
};

exports.getUserTweets = async function (user_id, page) {
  const data = await tweetController.getTweets(
    { author: ObjectId(user_id), referenced_tweet: { $size: 0 } },
    page,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.getUserReplies = async function (user_id, page) {
  const data = await tweetController.getTweets(
    { author: ObjectId(user_id), "referenced_tweet.type": "replied_to" },
    page,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.getUserRetweets = async function (user_id, page) {
  const data = await tweetController.getTweets(
    { author: ObjectId(user_id), "referenced_tweet.type": "retweet_of" },
    page,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.getUserMentions = async function (user_id, page) {
  const { account_name } = await User.findById(user_id, "account_name");

  const data = await tweetController.getTweets(
    {
      "entities.mentions.account_name": account_name,
      referenced_tweet: { $size: 0 },
    },
    page,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.getUserBookmarks = async function (user_id, page) {
  const user = await User.findById(user_id, "bookmarks");

  const data = await tweetController.getTweets(
    {
      _id: { $in: user.bookmarks },
    },
    page,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.createUser = async function (userData) {
  const data = new User(userData);

  await data.save();

  await Setting.create({ user_id: data._id, username: data.account_name });

  return true;
};

exports.getUserFeed = async function (user_id, page) {
  const { account_name } = await User.findById(user_id, "account_name");

  const followings = await Friendship.find({
    followed_by: ObjectId(user_id),
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
    account_name,
    ...followings.map((following) => following.account_name),
  ];
  const following_ids = [
    user_id,
    ...followings.map((following) => following._id),
  ];

  const tweets = await Tweet.find(
    {
      author: { $in: following_ids },
      referenced_tweet: [],
    },
    "createdAt"
  ).transform(function (docs) {
    return docs.map((doc) => {
      return { ...doc._doc, message: "" };
    });
  });

  const retweets = await Tweet.find(
    {
      author: { $in: following_ids },
      "referenced_tweet.type": "retweet_of",
    },
    "createdAt referenced_tweet author"
  ).transform(function (docs) {
    return docs.map((doc) => {
      const { referenced_tweet, author, ...restDoc } = doc._doc;
      const ref = referenced_tweet[referenced_tweet.length - 1];
      return {
        _id: ref.id,
        ...restDoc,
        message:
          author === user_id
            ? ""
            : accountNames[
                following_ids.findIndex(
                  (id) => id.toString() === author.toString()
                )
              ] + " Retweeted",
      };
    });
  });

  const replies = await Tweet.find(
    {
      author: { $in: following_ids },
      "referenced_tweet.type": "replied_to",
    },
    "createdAt referenced_tweet author"
  ).transform(function (docs) {
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

  const liked_tweets = await Favorite.find(
    {
      author: { $in: following_ids },
    },
    "tweet author createdAt -_id"
  ).transform(function (docs) {
    return docs.map((doc) => {
      const { tweet, author, ...restDoc } = doc._doc;

      return {
        _id: tweet,
        ...restDoc,
        message:
          author === user_id
            ? ""
            : accountNames[
                following_ids.findIndex(
                  (id) => id.toString() === author.toString()
                )
              ] + " Liked",
      };
    });
  });

  const mentioned_tweets = await Tweet.find(
    {
      "entities.mentions.account_name": { $in: accountNames },
    },
    "createdAt entities"
  ).transform(function (docs) {
    return docs.map((doc) => {
      const { entities, ...restDoc } = doc._doc;
      return {
        ...restDoc,
        message: entities.mentions.find(
          (mention) => mention.account_name === account_name
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
              (ref_tweet_id) => ref_tweet_id.toString() === tweet._id.toString()
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

  const pagedTweets = unique_tweets.slice(parseInt(page), parseInt(page) + 10);

  const ids = pagedTweets.map((tweet) => tweet._id);
  const ref_ids = [];

  pagedTweets.forEach((obj) => {
    if (obj.ref_tweet_ids) ref_ids.push(...obj.ref_tweet_ids);
  });

  var ref_tweets = await Tweet.find({ _id: { $in: ref_ids } }).populate(
    "author",
    "name account_name auth_id profile_image_url"
  );

  var final_tweets = await Tweet.find({ _id: { $in: ids } }).populate(
    "author",
    "name account_name auth_id profile_image_url"
  );

  var data = pagedTweets.map((obj) => {
    var tweet = final_tweets.find(
      (t) => t._id.toString() === obj._id.toString()
    );
    var ref_tweet = obj.ref_tweet_ids?.map((id) =>
      ref_tweets.find((t) => t._id.toString() === id.toString())
    );

    return { ...tweet._doc, referenced_tweet: ref_tweet, message: obj.message };
  });

  return { data, hasMore: data.length === 10 };
};

exports.deleteUser = async function (user_id) {
  await User.deleteOne({ _id: user_id });
  await Tweet.deleteMany({ author: user_id });
  await Favorite.deleteMany({ author: user_id });
  await Follow.deleteMany({ follower: user_id });
  await Follow.deleteMany({ following: user_id });
}