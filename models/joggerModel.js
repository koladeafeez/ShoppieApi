const mongoose = require("mongoose");
const { Schema } = mongoose;

const joggersModel = new Schema({
  productname: {
    type: String,
    require,
  },
  producttype: {
    type: String,
  },
  price: {
    type: Number,
    require,
  },
  imageId: {
    type: Array,
    require,
  },
  images: {
    type: Array,
    default: [],
    require,
  },
  type: {
    type: String,
    require,
  },
  length: {
    type: String,
    require,
  },
  shortdetails: {
    type: String,
    require,
  },
  longdetails: {
    type: String,
    require,
  },
  hasshort: {
    type: Boolean,
    default: false,
  },
  haslong: {
    type: Boolean,
    default: true,
  },
  hastrouser: {
    type: Boolean,
    default: true,
  },
  onstock: {
    type: Boolean,
    default: true,
  },
  latest: {
    type: Boolean,
    default: true,
  },
  inshowcase: {
    type: Boolean,
  },

  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
});

module.exports = mongoose.model("Joggers", joggersModel);
