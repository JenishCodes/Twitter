const mongoose = require("mongoose");

const { ObjectId } = mongoose.SchemaTypes;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      auth_id: {
        type: String,
        required: true,
        unique: true,
      },
      account_name: {
        type: String,
        required: true,
        maxlength: 15,
        unique: true,
      },
      name: {
        type: String,
        required: true,
        maxlength: 50,
      },
      description: {
        type: String,
        maxlength: 256,
        default: "",
      },
      pinned_tweet: {
        type: ObjectId,
        ref: "Tweet",
        default: null,
      },
      bookmarks: [
        {
          type: ObjectId,
          ref: "Tweet",
          _id: false,
        },
      ],
      website: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      profile_image_url: {
        type: String,
        default:
          "https://firebasestorage.googleapis.com/v0/b/twitter-webapp-clone.appspot.com/o/profile_images%2Fprofile_images%2Fdefault_profile_image.jpg?alt=media&token=7b63b3aa-9eb4-42d4-99ed-7b88bf097404",
      },
      banner_image_url: {
        type: String,
        default: "",
      },
      followers_count: { type: Number, default: 0 },
      following_count: { type: Number, default: 0 },
      tweets_count: { type: Number, default: 0 },
      favourites_count: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

exports.User = User;
