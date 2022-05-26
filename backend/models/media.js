const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const Media = mongoose.model("Media", new mongoose.Schema({
    type: {
        type: String,
        enum: ['video', 'image', 'gif'],
        required:true
    },
    width: {
        type: Number,
        required:true
    },
    height: {
        type: Number,
        required:true
    }
}))

exports.Media = Media