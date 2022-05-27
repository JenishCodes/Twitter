const express = require("express");
const { Tweet } = require("../models/tweet");
const { User } = require("../models/user");
const { getTweets, getTweet } = require("../utils");
const { Types, isValidObjectId } = require("mongoose");
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

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.get("/replies", async function (req, res) {
  try {
    var replies = await Tweet.find({
      referenced_tweet: {
        $elemMatch: { id: req.query.id, type: "replied_to" },
      },
    });

    const authors = await Promise.all(
      replies.map(
        async (reply) =>
          await User.findById(reply.author_id, {
            name: 1,
            account_name: 1,
            profile_image_url: 1,
            auth_id: 1,
          })
      )
    );

    replies = replies.map((reply, index) => {
      return { ...reply._doc, author: authors[index] };
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
    const tweet = await Tweet.findById(req.query.id, {
      referenced_tweet: 1,
      _id: 0,
    });

    const referenced_tweets = await Promise.all(
      tweet.referenced_tweet.map(async (reference) => {
        const ref_tweet = await Tweet.findById(reference.id);
        if (ref_tweet) {
          const ref_tweet_author = await User.findById(ref_tweet.author_id);
          return { ...ref_tweet._doc, author: ref_tweet_author };
        } else {
          return null;
        }
      })
    );

    res.send({ data: referenced_tweets });
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

// router.get("/tweet_timeline", async function (req, res) {
//   try {
//     var tweet = await Tweet.aggregate([
//       { $match: { _id: ObjectId(req.query.id) } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "author_id",
//           foreignField: "_id",
//           as: "author",
//         },
//       },
//     ]);

//     const replies = await Tweet.aggregate([
//       { $match: { _id: ObjectId(req.query.id) } },
//       {
//         $graphLookup: {
//           from: "tweets",
//           startWith: "$_id",
//           connectFromField: "_id",
//           connectToField: "referenced_tweet.id",
//           as: "children",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "children.author_id",
//           foreignField: "_id",
//           as: "children_author_list",
//         },
//       },
//       {
//         $project: {
//           children: 1,
//           children_author_list: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     const replieds = await Tweet.aggregate([
//       { $match: { _id: ObjectId(req.query.id) } },
//       {
//         $graphLookup: {
//           from: "tweets",
//           startWith: "$referenced_tweet.id",
//           connectFromField: "referenced_tweet.id",
//           connectToField: "_id",
//           as: "parents",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "parents.author_id",
//           foreignField: "_id",
//           as: "parents_author_list",
//         },
//       },
//       {
//         $project: {
//           parents: 1,
//           parents_author_list: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     const childrens = replies[0].children.map((reply) => ({
//       ...reply,
//       author: replies[0].children_author_list.find(
//         (author) => author._id.toString() === reply.author_id.toString()
//       ),
//     }));

//     const parents = replieds[0].parents.map((replied) => {
//       return {
//         ...replied,
//         author: replieds[0].parents_author_list.find(
//           (author) => author._id.toString() === replied.author_id.toString()
//         ),
//       };
//     });

//     tweet = { ...tweet[0], author: tweet[0].author[0] };

//     res.send({
//       tweet,
//       replies: childrens,
//       referenced_tweets: parents,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400);
//     res.send(err.message);
//   }
// });

// router.get("/user_timeline", async function (req, res) {
//   try {
//     var data;
//     var user = await User.findOne({ account_name: req.query.author });

//     if (req.query.request_type) {
//       if (req.query.request_type === "likes") {
//         data = await Favorite.aggregate([
//           { $match: { author_id: user._id } },
//           {
//             $lookup: {
//               from: "tweets",
//               localField: "tweet_id",
//               foreignField: "_id",
//               as: "tweet",
//             },
//           },
//           {
//             $lookup: {
//               from: "users",
//               localField: "tweet.author_id",
//               foreignField: "_id",
//               as: "author",
//             },
//           },
//           {
//             $project: {
//               tweet: 1,
//               author: 1,
//               _id: 0,
//             },
//           },
//         ]);

//         data = data.map((d) => {
//           return { ...d.tweet[0], author: d.author[0] };
//         });
//       } else {
//         data = await Tweet.aggregate([
//           {
//             $match: {
//               author_id: user._id,
//               "referenced_tweet.type": req.query.request_type,
//             },
//           },
//           {
//             $lookup: {
//               from: "users",
//               localField: "author_id",
//               foreignField: "_id",
//               as: "author",
//             },
//           },
//         ]);

//         data = data.map((d) => {
//           return { ...d, author: d.author[0] };
//         });
//       }
//     } else {
//       data = await Tweet.aggregate([
//         { $match: { author_id: user._id, referenced_tweet: [] } },
//         {
//           $lookup: {
//             from: "users",
//             localField: "author_id",
//             foreignField: "_id",
//             as: "author",
//           },
//         },
//       ]);

//       data = data.map((d) => {
//         return { ...d, author: d.author[0] };
//       });
//     }

//     res.send({ tweets: data, user });
//   } catch (err) {
//     console.log(err);
//     res.status(400);
//     res.send(err.message);
//   }
// });

// router.get("/mention_timeline", async function (req, res) {
//   try {
//     if (req.query.trim_user) {
//       const tweets = await Tweet.find({
//         "entities.mentions.user_id": req.query.id,
//       });

//       res.send(tweets);
//     } else {
//       const tweets = await Tweet.aggregate([
//         {
//           $lookup: {
//             from: "User",
//             localField: "author_id",
//             as: "author",
//             foreignField: "_id",
//           },
//         },
//       ]).find({
//         entities: {
//           " mentions.tag": req.query.user,
//         },
//       });

//       res.send(tweets);
//     }
//   } catch (err) {
//     console.log(err.messsage);
//     res.status(400);
//     res.send(err.message);
//   }
// });

module.exports = router;
