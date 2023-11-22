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
    photos: {
        type: Array,
    }
  },
  { timestamps: true }
);

const UserDB = new mongoose.model("User", userSchema);

module.exports = { UserDB };
