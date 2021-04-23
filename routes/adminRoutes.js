/* eslint-disable no-param-reassign */
const express = require("express");
const accountsController = require("../controllers/adminController");
const upload = require("../utility/multer");
const fs = require("fs");
const path = require("path");

function routes(Jogger, imageModel) {
  const adminRouter = express.Router();
  const controller = accountsController(Jogger, imageModel);
  adminRouter.post(
    "/addJogger",
    upload.array("image", 12),
    (req, res, next) => {
      res.check = [];

      res.imageArr = [];
      req.files.forEach(async (file) => {
        var obj = {
          name: req.body.name,
          desc: req.body.desc,
          img: {
            data: fs.readFileSync(
              path.join(__dirname, "../" + "/uploads/" + file.filename)
            ),
            contentType: "image/jpeg",
          },
        };
        // obj.img.data = new Buffer(obj.img.data, "binary").toString("base64");
        console.log(obj.img.data);
        res.check.push(obj);
      });
      next();
    }
  );
  adminRouter.route("/addJogger").post(controller.addJogger);

  // accountRouter.route("/addAsooke").post(controller.addAsooke);

  return adminRouter;
}

module.exports = routes;
