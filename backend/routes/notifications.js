const express = require("express");
const { Types } = require("mongoose");
const { Notification } = require("../models/notification");

const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const notifications = await Notification.find({
      user: Types.ObjectId(req.query.id),
    })
      .sort({ createdAt: -1 })
      .skip(req.query.limit * req.query.cursor)
      .limit(req.query.limit);

    res.send({ data: notifications });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/unseen", async function (req, res) {
  try {
    const unseen = await Notification.countDocuments({
      user: Types.ObjectId(req.query.id),
      seen: false,
    });

    res.send({ data: unseen });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/read/:notificationId", async function (req, res) {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, {
      read: true,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/seen", async function (req, res) {
  try {
    await Notification.updateMany(
      { user: req.query.id, seen: false },
      { $set: { seen: true } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
