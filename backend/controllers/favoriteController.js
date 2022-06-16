const { Favorite } = require("../models/favorite");
const tweetController = require("./tweetController");
const userController = require("./userController");
const { ObjectId } = require("mongoose").Types;

exports.destoryFavorites = async function (tweet) {
  await Favorite.deleteMany({ tweet: ObjectId(tweet) });

  return true;
};

exports.deleteFavorite = async function (tweet, author) {
  const favorite = await Favorite.findOne({
    author: ObjectId(favoriteData.author),
    tweet: ObjectId(favoriteData.tweet),
  });

  if (favorite) {
    await Favorite.findByIdAndRemove(favorite._id);

    await tweetController.updateTweetDetails(tweet, {
      $inc: { "public_metrics.like_count": -1 },
    });

    await userController.updateUserDetails(author, {
      $inc: { favourites_count: -1 },
    });
  }

  return true;
};

exports.isFavorite = async function (tweet, user) {
  const data = await Favorite.findOne({
    tweet: ObjectId(tweet),
    author: ObjectId(user),
  });

  return data ? true : false;
};

exports.getFavoriters = async function (tweet, page) {
  const data = await Favorite.find({ tweet: ObjectId(tweet) })
    .skip(page)
    .limit(10)
    .select("author -_id")
    .populate("author")
    .transform((docs) => docs.map((doc) => doc._doc.author));

  return { data, hasMore: data.length === 10 };
};

exports.getFavorites = async function (user, page) {
  const tweets = await Favorite.find({ author: ObjectId(user) })
    .skip(page)
    .limit(10)
    .select("tweet -_id")
    .transform((docs) => docs.map((doc) => doc._doc.tweet));

  const data = await tweetController.getTweets(
    { _id: { $in: tweets } },
    0,
    "name account_name profile_image_url auth_id"
  );

  return { data, hasMore: data.length === 10 };
};

exports.createFavorite = async function (favoriteData) {
  await Favorite.create(favoriteData);

  await userController.updateUserDetails(favoriteData.author, {
    $inc: { favourites_count: 1 },
  });

  await tweetController.updateTweetDetails(favoriteData.tweet, {
    $inc: { "public_metrics.like_count": 1 },
  });

  return true;
};
