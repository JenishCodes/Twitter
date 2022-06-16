const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Favorite = mongoose.model(
  "Favorite",
  new mongoose.Schema(
    {
      author: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      tweet: {
        type: ObjectId,
        ref: "Tweet",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

exports.Favorite = Favorite;
