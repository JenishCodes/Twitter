const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Favorite = mongoose.model(
  "Favorite",
  new mongoose.Schema(
    {
      author_id: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      tweet_id: {
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
