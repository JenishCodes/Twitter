const express = require("express");
const {
  searchTweets,
  updateTweetDetails,
  deleteTweet,
  createTweet,
  getTweetReplies,
  getTweetReferences,
  getTweetRetweeters,
  isRetweeter,
  getTweet,
} = require("../controllers/tweetController");

const router = express.Router();

router.get("/search", async function (req, res) {
  try {
    const data = await searchTweets(req.query.query, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:tweet_id", async function (req, res) {
  try {
    const data = await getTweet(req.params.tweet_id, "", req.query.include);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.delete("/:tweet_id", async function (req, res) {
  try {
    const data = await deleteTweet(req.params.tweet_id, req.query.author_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/create", async function (req, res) {
  try {
    console.log(req.body)
    const data = await createTweet(req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.put("/:tweet_id", async function (req, res) {
  try {
    const data = await updateTweetDetails(req.params.tweet_id, req.body);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.get("/:tweet_id/replies", async function (req, res) {
  try {
    const data = await getTweetReplies(req.params.tweet_id, req.query.user_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:tweet_id/references", async function (req, res) {
  try {
    const data = await getTweetReferences(req.params.tweet_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:tweet_id/isRetweeter", async function (req, res) {
  try {
    const data = await isRetweeter(req.params.tweet_id, req.query.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:tweet_id/retweeters", async function (req, res) {
  try {
    const data = await getTweetRetweeters(req.params.tweet_id, req.query.page);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

module.exports = router;
