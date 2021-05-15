const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const grid = require("gridfs-stream");
const fs = require("fs");
const cors = require("cors");

const { welcome } = require("./utility/mail");

const upload = require("./utility/multer");

const bodyParser = require("body-parser");
const VerifyToken = require("./utility/VerifyToken");
const sendImageToDb = require("./helper/writebinary");

const filesrc = path.join(__dirname, "./filestoread/logo3.png");

const app = express();

app.use(cors());

if (process.env.NODE_ENV === "production") {
  console.log("prod");
  const db = mongoose.connect(
    "mongodb+srv://user1:Sifahdais@cluster0.ajo7k.mongodb.net/Shoppie",
    { useNewUrlParser: true }
  );
} else {
  require("dotenv").config();
  if (process.env.NODE_ENV === "development") {
    const db = mongoose.connect("mongodb://localhost/Shoppie");
    console.log("dev");
  }
}

// console.log(db);
const connection = mongoose.connection;

if (connection !== "undefined") {
  // sendImageToDb();
  console.log("connection ok");
} else {
  console.log("Sorry No Connection");
}

const port = process.env.PORT || 4000;
const User = require("./models/registerModel");
const Login = require("./models/loginModel");
const Jogger = require("./models/joggerModel");
const Asooke = require("./models/asookeModel");
const imgModel = require("./models/imageModel");
const { Grid } = require("gridfs-stream");
const imageModel = require("./models/imageModel");
const { nextTick } = require("process");

const accountRouter = require("./routes/accountRouter")(User);
const joggerRouter = require("./routes/joggerRouter")(Jogger, imageModel);
const asookeRouter = require("./routes/asookeRouter")(Asooke);
const adminRouter = require("./routes/adminRoutes")(Jogger, imageModel);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/account", accountRouter);
app.use("/api/product/joggers", joggerRouter);
app.use("/api/product/asookes", asookeRouter);
app.use("/api/admin", adminRouter);

// app.get("/", VerifyToken, (req, res, next) => {
//   User.findById(req.userId, { password: 0 }, (err, user) => {
//     if (err)
//       return res.status(500).send("There was a problem finding the user.");
//     if (!user) return res.status(404).send("No User Found");

//     res.status(200).send(user);
//   });
// });

// app.use("/all", async (req, res, next) => {
//   let value = [];

//   let img = await imgModel.find({});
//   res.Data = img;

//   console.log("valOut", res.Data);
//   next();
// });

// app.get("/all", (req, res) => {
//   console.log("in next");
//   // res.value.forEach((data) => {
//   //   console.log(data);
//   // });
//   res.json(res.Data);
// });

app.use("/all", async (req, res, next) => {
  res.Data = [];
  let asooke = await Asooke.find({ inshowcase: true });
  res.Data.push(asooke);

  let joggers = await Jogger.find({ inshowcase: true });
  res.Data.push(joggers);
  return next();
});

app.get("/all", async (req, res) => {
  let imagesArr = [];
  for (let i = 0; i < res.Data[1].length; i++) {
    let query = [];

    for (let k = 0; k < res.Data[1][i].imageId.length; k++) {
      query.push({ _id: res.Data[1][i].imageId[k] });
    }

    console.log("query", query);

    let images = await imageModel.find({ $or: query });

    images.forEach(async (img, j) => {
      let imgObj = {
        contentType: img.img.contentType,
        imgSource: img.img.data.toString("base64"),
      };

      res.Data[1][i].images.push(imgObj);
      imagesArr.push(imgObj);
    });
  }

  console.log(imagesArr.length);
  res.json(res.Data);
});

app.get("/test", (req, res) => {
  Jogger.find({}, (err, data) => {
    console.log(data);
    if (err) res.json(err);
    res.json(data);
  });
});

app.post("/api/cart", async (req, res) => {
  let data = req.body;

  let joggers = data.filter((el) => el.type === "joggers");
  let asookes = data.filter((el) => el.type === "asooke");
  asookes.forEach((data) => joggers.push(data));

  const promises = [];
  let joggersLength = joggers.length - asookes.length;
  let asookeLength = asookes.length; //4
  let loopLength = joggersLength + asookeLength; //7

  for (let i = 0; i < loopLength; i++) {
    if (i < joggersLength) {
      let jogger = await Jogger.findById(joggers[i]._id);
      let query = [];
      jogger.imageId.forEach((id) => {
        query.push({ _id: id });
      });
      let images = await imageModel.find({ $or: query });

      images.forEach((img, i) => {
        let imgObj = {
          contentType: img.img.contentType,
          imgSource: img.img.data.toString("base64"),
        };
        jogger.images.push(imgObj);
      });
      promises.push(jogger);
    } else {
      let asooke = await Asooke.findById(joggers[i]._id);
      let query = [];
      asooke.imageId.forEach((id) => {
        query.push({ _id: id });
      });
      let images = await imageModel.find({ $or: query });

      images.forEach((img, i) => {
        let imgObj = {
          contentType: img.img.contentType,
          imgSource: img.img.data.toString("base64"),
        };
        asooke.images.push(imgObj);
      });
      promises.push(asooke);
    }
  }

  Promise.allSettled(promises).then((results) => {
    let rejectedItem = 0;
    let fulfilledItems = [];
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        fulfilledItems.push(result.value);
      } else {
        rejectedItems += 1;
      }
    });
    res.status(200).json({ data: fulfilledItems, notFound: rejectedItem });
  });
});

// app.get("/img/:id", (req, res) => {
//   imgModel.findById(req.params.id, (err, data) => {
//     res.json(data.img.data.toString("base64"));
//   });
// });

// app.set("view engine", "ejs");

// app.get("/ejs/:id", (req, res) => {
//   imgModel.findById(req.params.id, (err, items) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("An error occurred", err);
//     } else {

//       res.json({ items: items.img.data.toString("base64") });
//     }
//   });
// });

// app.post("/", upload.array("image", 12), (req, res, next) => {
//   req.files.forEach((file) => {
//     var obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//         data: fs.readFileSync(
//           path.join(__dirname + "/uploads/" + file.filename)
//         ),
//         contentType: "image/png",
//       },
//     };

//     imgModel.create(obj, (err, item) => {
//       if (err) {
//         console.log(err);
//       } else {
//         // item.save();
//         res.redirect("/ejs");
//       }
//     });
//   });
// });

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;
