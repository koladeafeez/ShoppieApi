const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersModel = new Schema({
  firstname: {
    type: String,
    require,
  },
  lastname: {
    type: String,
    require,
  },
  email: {
    type: String,
    require,
  },
  password: {
    type: String,
    require,
  },
  role: {
    type: String,
    default: "basic",
    enum: ["Admin", "basic"],
    require,
  },
  accessToken: {
    type: String,
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", usersModel);
