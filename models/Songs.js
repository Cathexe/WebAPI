const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
    songName:String,
    artist:String
});

const Songs = mongoose.model("Songs", musicSchema, "Music");

module.exports = Songs;