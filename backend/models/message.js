const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      conversationId: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      sender: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      receiver: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

exports.Message = Message;
