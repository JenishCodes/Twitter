const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Tweet = mongoose.model(
  "Tweet",
  new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
        maxlength: 256,
      },
      author: {
        type: ObjectId,
        required: true,
        ref: "User",
      },
      reply_settings: {
        type: String,
        enum: ["everyone", "followings", "nobody"],
        default: "everyone",
      },
      media: {
        type: String,
        default: "",
      },
      entities: {
        hashtags: [
          {
            start: Number,
            end: Number,
            tag: String,
            _id: false,
          },
        ],
        urls: [
          {
            start: Number,
            end: Number,
            url: String,
            _id: false,
          },
        ],
        mentions: [
          {
            start: Number,
            end: Number,
            account_name: String,
            _id: false,
          },
        ],
      },
      public_metrics: {
        like_count: { type: Number, default: 0 },
        retweet_count: { type: Number, default: 0 },
        reply_count: { type: Number, default: 0 },
      },
      private_metrics: {
        detail_expands: { type: Number, default: 0 },
        profile_visits: { type: Number, default: 0 },
      },
      referenced_tweet: [
        {
          type: {
            type: String,
            enum: ["replied_to", "retweet_of", "quoated_from"],
          },
          id: {
            type: ObjectId,
            ref: "Tweet",
          },
          _id: false,
        },
      ],
    },
    { timestamps: true }
  )
);

exports.Tweet = Tweet;
