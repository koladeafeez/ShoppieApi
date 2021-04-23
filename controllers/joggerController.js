const enCrypt = require("../utility/bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");
const authenticationMiddleware = require("../routes/authenticateRequest");

function joggersController(Jogger, imageModel) {
  function get(req, res) {
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
        new Promise((resolve, reject) => {
          result.results.forEach(async (product, i) => {
            let query = [];

            product.imageId.forEach((id, i) => {
              query.push({ _id: id });
            });
            let images = await imageModel.find({ $or: query });
            // let images = await imageModel.find(
            //   { $or: query },
            //   (error, image) => {
            //     image.forEach((img, i) => {
            //       let imgObj = {
            //         contentType: img.img.contentType,
            //         imgSource: img.img.data.toString("base64"),
            //       };
            //       product.images.push(imgObj);
            //     });
            //   }
            // );
            images.forEach((img, i) => {
              let imgObj = {
                contentType: img.img.contentType,
                imgSource: img.img.data.toString("base64"),
              };
              product.images.push(imgObj);
            });

            if (i === result.results.length - 1) resolve(result);
          });
        })
          .then((data) => {
            console.log(data);
            res.status(200).json(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (e) {
      res.json({ message: e.message });
    }
  }

  return { get };
}

module.exports = joggersController;
