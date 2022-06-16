const express = require("express");
const {
  getUserHistory,
  updateUserHistory,
  deleteUserHistory,
  isAccountNameAvailable,
  updateAccountName,
  getUserReplies,
  getUserRetweets,
  getUserMentions,
  getUserFeed,
  updateUserDetails,
  createUser,
  getUserSettings,
  updateUserSettings,
  getUserBookmarks,
  getUserTweets,
  getUser,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    const { query, page, limit, deep_search } = req.query;
    const data = await searchUsers(query, page, limit, deep_search);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/settings", async (req, res) => {
  try {
    const data = await getUserSettings(req.params.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.put("/:user_id/settings", async (req, res) => {
  try {
    const data = await updateUserSettings(req.params.user_id, req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/history", async function (req, res) {
  try {
    const data = await getUserHistory(req.params.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.post("/:user_id/history", async function (req, res) {
  try {
    const data = await updateUserHistory(req.params.user_id, req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});
router.delete("/:user_id/history", async function (req, res) {
  try {
    const data = await deleteUserHistory(
      req.params.user_id,
      req.query.delete_all
    );

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/", async function (req, res) {
  try {
    const { key, value, field, include } = req.query;
    const data = await getUser(key, value, field, include);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/isAccountNameAvailable", async function (req, res) {
  try {
    const data = await isAccountNameAvailable(req.query.account_name);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:user_id/updateAccountName", async function (req, res) {
  try {
    const data = await updateAccountName(
      req.params.user_id,
      req.body.account_name
    );

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/replies", async function (req, res) {
  try {
    const data = await getUserReplies(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/retweets", async function (req, res) {
  try {
    const data = await getUserRetweets(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/bookmarks", async function (req, res) {
  try {
    const data = await getUserBookmarks(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/mentions", async function (req, res) {
  try {
    const data = await getUserMentions(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/tweets", async function (req, res) {
  try {
    const data = await getUserTweets(req.params.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/feed", async function (req, res) {
  try {
    const data = await getUserFeed(req.params.user_id, req.query.page);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:user_id/bookmark", async function (req, res) {
  try {
    const data = await updateUserDetails(req.params.user_id, {
      $push: { bookmarks: req.body.tweet_id },
    });

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:user_id/unbookmark", async function (req, res) {
  try {
    const data = await updateUserDetails(req.params.user_id, {
      $pull: { bookmarks: req.body.tweet_id },
    });

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const data = await createUser(req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.put("/:user_id", async function (req, res) {
  try {
    const data = await updateUserDetails(req.params.user_id, req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.delete("/:user_id", async function (req, res) {
  try {
    const data = await deleteUser(req.params.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
