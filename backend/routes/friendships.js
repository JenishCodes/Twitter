const express = require("express");
const { Friendship } = require("../models/friendship");
const { Setting } = require("../models/settings");
const { User } = require("../models/user");
const { getUser } = require("../utils");

const router = express.Router();

router.get("/followers", async function (req, res) {
  const user = await getUser(req.query.account_name, "account_name");

  const users = await Friendship.aggregate([
    { $match: { following: user.data._id } },
    { $skip: parseInt(req.query.page) },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "followed_by",
        foreignField: "_id",
        as: "user",
      },
    },
    { $project: { _id: 0, user: { $first: "$user" } } },
  ]);

  const followers = users.map((user) => user.user);

  res.send({ data: followers, hasMore: followers.length === 10 });
});

router.get("/following", async function (req, res) {
  const user = await getUser(req.query.account_name, "account_name");

  const users = await Friendship.aggregate([
    { $match: { followed_by: user.data._id } },
    { $skip: parseInt(req.query.page) },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "user",
      },
    },
    { $project: { _id: 0, user: { $first: "$user" } } },
  ]);

  const following = users.map((user) => user.user);

  res.send({ data: following, hasMore: following.length === 10 });
});

router.get("/", async function (req, res) {
  const relationship = await Friendship.findOne({
    friendship_id: req.query.friendship_id,
  });

  res.send({ data: relationship });
});

router.post("/", async function (req, res) {
  try {
    await Friendship.create(req.body);

    await User.findByIdAndUpdate(req.body.followed_by, {
      $inc: { following_count: 1 },
    });

    await User.findOneAndUpdate(req.body.following, {
      $inc: { followers_count: 1 },
    });

    const target = await Setting.findOne({ userId: req.body.following });

    if (target.followNotification) {
      const actor = await User.findById(req.body.followed_by);

      Notification.create({
        message: `${actor.account_name} is now following you`,
        user: req.body.following,
        read: false,
        action: "/" + actor.account_name,
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.delete("/", async function (req, res) {
  try {
    await Friendship.findOneAndDelete({
      followed_by: req.query.source_id,
      following: req.query.target_id,
    });

    await User.findByIdAndUpdate(req.query.source_id, {
      $inc: { following_count: -1 },
    });

    await User.findByIdAndUpdate(req.query.target_id, {
      $inc: { followers_count: -1 },
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

// destroy blocking
// create blocking
// report user
module.exports = router;
