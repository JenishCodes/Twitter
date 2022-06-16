const express = require("express");
const {
  markAllNotificationsAsSeen,
  markNotificationAsRead,
  getUnseenNotificationCount,
  getUserNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/:user_id", async function (req, res) {
  try {
    const data = await getUserNotifications(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/unseen", async function (req, res) {
  try {
    const data = await getUnseenNotificationCount(req.params.user_id);

    res.send({count:data});
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:notificationId/read", async function (req, res) {
  try {
    const data = await markNotificationAsRead(req.params.notificationId);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:user_id/seen", async function (req, res) {
  try {
    const data = await markAllNotificationsAsSeen(req.params.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
