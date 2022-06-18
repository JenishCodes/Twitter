const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ObjectId } = mongoose.SchemaTypes;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    account_name: {
      type: String,
      required: true,
      maxlength: 30,
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
        "https://firebasestorage.googleapis.com/v0/b/twitter-webapp-clone.appspot.com/o/profile_images%2Fdefault_profile_image.jpg?alt=media&token=c3e0b3d1-3739-4edd-99b3-b6863946f570",
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
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.statics.generateAnonymousAuthToken = function () {
  return jwt.sign({ _id: "anonymous" }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

userSchema.methods.verifyPassword = async function (candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model("User", userSchema);

exports.User = User;
