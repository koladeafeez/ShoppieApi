const enCrypt = require("../utility/bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");
const authenticationMiddleware = require("../routes/authenticateRequest");

function joggersController(Jogger) {
  function get(req, res) {
    const filter = req.query.filter;
    const price = req.query.price;
    let query;

    // let filterByPrice = search === undefined ?

    const isUndefineOrNull =
      filter === "" || filter === undefined ? "novalue" : "hasvalue";

    if (isUndefineOrNull === "novalue") {
      price === undefined ? (query = {}) : (query = { price: price });
    } else if (isUndefineOrNull === "hasvalue") {
      let queryArray = [{ productname: filter }, { type: filter }];
      queryArray.push({ price: { $lte: price } });
      price === undefined
        ? (query = { $or: [{ productname: filter }, { type: filter }] })
        : (query = { $or: queryArray });
    }

    console.log("isNullOrUndefined", isUndefineOrNull);
    console.log("query", query);

    console.log("query", query);

    const result = {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
      Jogger.find(query, (err, joggers) => {
        console.log(joggers.length);
        // if (err) returnres.status(404).send(err);
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
        // res.paginatedResult = result;
        // console.log(next());
        // next();
        res.json(result);
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
    // res.status(200).json(res.paginatedResult);

    // console.log(req.result);
    // res.status(200).json(res);
    // const userInfo = res.locals.user;
    // const userId = userInfo.id;
    // console.log("id and ifo", userId, userInfo);
    // userInfo.role === "basic"

    // Jogger.find({}, (err, joggers) => {
    //   if (err) res.status(404).send(err);

    //   result.results = joggers.slice(startIndex, endIndex);
    //   res.status(200).json(result);
    // });
    // : res.status(403).send("forbiden request");
  }

  return { get };
}

module.exports = joggersController;
