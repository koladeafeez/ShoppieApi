function paginate(model) {
  return (req, res, next) => {
    const result = {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
      model.find({}, (err, joggers) => {
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
        res.paginatedResult = result;
        // console.log(next());
        next();
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

module.exports = paginate;
