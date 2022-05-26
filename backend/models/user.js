const mongoose = require("mongoose");

const { ObjectId } = mongoose.SchemaTypes;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
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
    pinned_tweet_id: {
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
    entities: {
      hashtags: [
        {
          start: Number,
          end: Number,
          tag: String,
        },
      ],
      urls: [
        {
          start: Number,
          end: Number,
          url: String,
        },
      ],
      mentions: [
        {
          start: Number,
          end: Number,
          tag: String,
        },
      ],
    },
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
        "https://firebasestorage.googleapis.com/v0/b/micro-blogging-web.appspot.com/o/profile_images%2Fdefault_user_image.png?alt=media&token=b51f1b08-2063-40a8-9fb1-2ee8654404fc",
    },
    banner_image_url: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/micro-blogging-web.appspot.com/o/banner_images%2Fdefault.png?alt=media&token=912425e2-c409-41bc-ae19-a7cf852cb513",
    },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    tweets_count: { type: Number, default: 0 },
    favourites_count: { type: Number, default: 0 },
  }, {timestamps: true})
);

exports.User = User;
