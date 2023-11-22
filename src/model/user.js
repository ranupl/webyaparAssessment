const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile: {
        type: String,
    },
    photos: [{
        data: Buffer,
        contentType: String,
    }],
  },
  { timestamps: true }
);

// we will create a new collection
const UserDB = new mongoose.model("User", userSchema);

module.exports = { UserDB };