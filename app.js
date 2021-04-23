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

// if (process.env.NODE_ENV === "production") {
//   console.log("prod");
const db = mongoose.connect(
  "mongodb+srv://user1:Sifahdais@cluster0.ajo7k.mongodb.net/Shoppie",
  { useNewUrlParser: true }
);
// } else {
//   require("dotenv").config();
//   if (process.env.NODE_ENV === "development") {
//     const db = mongoose.connect("mongodb://localhost/Shoppie");
//     console.log("dev");
//   }
// }

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

app.get("/all", (req, res) => {
  res.Data = [];
  Asooke.find({ latest: true }, (err, value) => {
    if (err) return res.status(500).send("server error");
    res.Data.push(value);
    Jogger.find({ latest: true }, (err, value) => {
      // if (err) res.status(500).send("server error");
      res.Data.push(value);
      res.status(200).json(res.Data);
    });
  });
});

app.get("/test", (req, res) => {
  Jogger.find({}, (err, data) => {
    console.log(data);
    if (err) res.json(err);
    res.json(data);
  });
});

app.post("/api/cart", (req, res) => {
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
      promises.push(Jogger.findById(joggers[i]._id));
    } else {
      promises.push(Asooke.findById(joggers[i]._id));
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
    console.log(fulfilledItems);
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
