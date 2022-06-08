const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
   
  })
);

exports.Notification = Notification;
