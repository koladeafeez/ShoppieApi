const mongoose = require("mongoose");
const { Schema } = mongoose;

const asookesModel = new Schema({
  productname: {
    type: String,
    require,
  },
  price: {
    type: Number,
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
  },
  haslong: {
    type: Boolean,
  },
  hastrouser: {
    type: Boolean,
  },
  onstock: {
    type: Boolean,
    default: true,
    require,
  },
  latest: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
});

module.exports = mongoose.model("Asookes", asookesModel);
