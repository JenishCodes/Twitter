const express = require("express");
const {
  getUserConversations,
  deleteConversation,
  getConversation,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const data = await getUserConversations(req.params.userId);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.messages);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const data = await getConversation(req.params.conversationId, req.query.user_id);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.messages);
  }
})

router.delete("/:conversationId", async (req, res) => {
  try {
    await deleteConversation(req.params.conversationId);

    res.send({ data: true });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err.messages);
  }
});

module.exports = router;
