const enCrypt = require("../utility/bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");
const { welcome } = require("../utility/mail");
// const role = require("../utility/role");

function accountsController(User) {
  function register(req, res) {
    const username = req.body.firstname;
    const password = req.body.password;
    const email = req.body.email;
    console.log(req.body);
    let hashValue;
    enCrypt()
      .enCrypt(password)
      .then((hash) => {
        if (req.body.firstname === "") {
          console.log("firstname", req.body.firstname);
          return res.status(400).json({ error: "No Firstname" });
        }
        console.log(req.body);
        // if (!req.body.email) {
        //   return res.status(400).json({ error: "Email is required" });
        // }

        User.findOne({ email: req.body.email }, (err, data) => {
          // if (data !== null) {
          //   return res.status(404).send("Email Already Register");
          // }
          const user = new User({
            ...req.body,
            password: hash,
            role: "basic",
          });
          // let token = jwt.sign({ id: user._id }, config.secret, {
          //   expiresIn: 86400, //expires in 24 hours
          // });
          // user.accessToken = token;
          user.save((state) => {
            console.log(state);
          });

          res.status(201);
          delete user.password;
          console.log(user);

          // welcome(email);
          return res.send({ auth: true, fname: user.firstname });
        }).catch((err) => {
          res.status(500).json({
            auth: false,
            message: "Sorry!!! Cant create User now, Pls Try Again",
          });
          // console.log(err);
          return err;
        });
      });
  }

  function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }, (err, user) => {
      if (user === null) {
        return res
          .status(404)
          .send({ auth: false, message: "Incorrect Username" });
      }
      const passwordHash = user.password;
      const username = user.firstname;
      const lastLogedIn = user.loginAt;
      console.log("header", req.headers.authorization);
      enCrypt()
        .checkUser(password, passwordHash)
        .then((status) => {
          if (status === false)
            return res.status(401).send({
              auth: false,
              token: null,
              message: "Incorrect Password",
            });
          var token = jwt.sign(
            { id: user._id, role: user.role },
            config.secret,
            {
              expiresIn: 86400,
            }
          );
          console.log("accesstokenis", token);
          User.findByIdAndUpdate(user._id, {
            // accessToken: token,
            loginAt: new Date(),
          });
          return res.status(200).send({
            auth: true,
            data: { email: user.email, role: user.role },
            accessToken: token,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.send({ message: "error" });
        });
    });
  }

  return { register, login };
}

module.exports = accountsController;
