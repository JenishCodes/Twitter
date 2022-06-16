const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
      },
      user: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      seen: {
        type: Boolean,
        default: false,
      },
      action: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

exports.Notification = Notification;
