var mongoose = require("mongoose");

const Conversation = mongoose.model(
  "Conversation",
  new mongoose.Schema(
    {
      conversationId: {
        type: String,
        required: true,
        unique: true,
      },
      lastMessage: {
          type: String,
          default: "",
      },
    },
    {
      timestamps: true,
    }
  )
);

exports.Conversation = Conversation;
