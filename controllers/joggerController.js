const enCrypt = require("../utility/bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");
const authenticationMiddleware = require("../routes/authenticateRequest");

function joggersController(Jogger, imageModel) {
  async function get(req, res) {
    const filter = req.query.search;
    const price = req.query.price;
    let query;
    console.log("price", req.query);

    const isUndefineOrNull =
      filter === "" || filter === undefined ? "novalue" : "hasvalue";

    if (isUndefineOrNull === "novalue") {
      price === undefined || price === "0"
        ? (query = {})
        : (query = { price: { $lte: price } });
    } else if (isUndefineOrNull === "hasvalue") {
      let queryArray = [{ productname: filter }, { type: filter }];
      queryArray.push({ price: { $lte: price } });
      price === undefined
        ? (query = { $or: [{ productname: filter }, { type: filter }] })
        : (query = { $or: queryArray });
    }

    const result = {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
      Jogger.find(query, (err, joggers) => {
        if (err) throw err;
        result.pageLimit = Math.ceil(joggers.length / limit);

        if (endIndex < joggers.length) {
          result.next = {
            page: page + 1,
            limit: limit,
          };
        }
        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit: limit,
          };
        }

        result.results = joggers.slice(startIndex, endIndex);

        new Promise(async (resolve, reject) => {
          for (let j = 0; j < result.results.length; j++) {
            let query = [];

            result.results[j].imageId.forEach((id, i) => {
              query.push({ _id: id });
            });
            let images = await imageModel.find({ $or: query });

            images.forEach((img, i) => {
              let imgObj = {
                contentType: img.img.contentType,
                imgSource: img.img.data.toString("base64"),
              };
              result.results[j].images.push(imgObj);
            });
          }
          resolve(result);
        }).then((data) => {
          res.json(data);
        });
      });
    } catch (e) {
      res.json({ message: e.message });
    }
  }

  return { get };
}

module.exports = joggersController;
