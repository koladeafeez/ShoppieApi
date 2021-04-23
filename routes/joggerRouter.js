/* eslint-disable no-param-reassign */
const express = require("express");
const joggersController = require("../controllers/joggerController");
const paginate = require("../helper/paginate");
const authenticationMiddleware = require("../routes/authenticateRequest");

// authenticationMiddleware,

function routes(Jogger, imageModel) {
  const joggersRouter = express.Router();
  const controller = joggersController(Jogger, imageModel);
  joggersRouter.route("/").get(controller.get);

  joggersRouter.use("/:id", (req, res, next) => {
    Jogger.findById(req.params.id, (err, jogger) => {
      if (err) {
        return res.send(err);
      }
      if (jogger) {
        req.jogger = jogger;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  joggersRouter
    .route("/:id")
    .get((req, res) => {
      res.json(req.jogger);
    })
    .patch((req, res) => {
      const { jogger } = req;
      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        jogger[key] = value;
      });
      req.jogger.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(jogger);
      });
    });

  return joggersRouter;
}

module.exports = routes;
