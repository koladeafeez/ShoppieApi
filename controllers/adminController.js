const enCrypt = require("../utility/bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");

function adminController(Jogger, imgModel) {
  async function addJogger(req, res) {
    let imgId = [];
    let id = [];
    res.check.forEach(async (val, i) => {
      try {
        let mode = await imgModel.create(val);
        id.push(mode._id);
        if (i === res.check.length - 1) {
          imgId = id;

          const jogger = await new Jogger({
            ...req.body,
            imageId: id,
            images: [],
          });
          jogger.save();
          res.json(mode);
        }
      } catch (err) {
        res.status(401).send("error creating image: bad image");
      }
    });
  }

  async function addJoggerPageImage(req, res) {
    
  
  }


  return { addJogger };
}

module.exports = adminController;
