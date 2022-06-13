const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Friendship = mongoose.model(
  "Friendship",
  new mongoose.Schema({
    blocking: {
      type: Boolean,
      default: false,
    },
    friendship_id: {
      type: String,
      required: true,
    },
    followed_by: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  })
);

exports.Friendship = Friendship;
