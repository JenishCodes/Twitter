const express = require("express");
const {
  isFavorite,
  getFavoriters,
  getFavorites,
  createFavorite,
  deleteFavorite,
} = require("../controllers/favoriteController");

const router = express.Router();

router.get("/isFavoriter", async function (req, res) {
  try {
    const data = await isFavorite(req.query.tweet_id, req.query.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:tweet_id/favoriters", async function (req, res) {
  try {
    const data = await getFavoriters(req.params.tweet_id, req.query.page);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.get("/:user_id/favorites", async function (req, res) {
  try {
    const data = await getFavorites(req.params.user_id, req.query.page);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const data = await createFavorite(req.body);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.delete("/", async function (req, res) {
  try {
    const data = await deleteFavorite(req.query.tweet_id, req.query.author_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

module.exports = router;
