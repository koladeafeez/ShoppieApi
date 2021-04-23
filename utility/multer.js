// Step 5 - set up multer for storing uploaded files

let multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({ storage: storage });

// let multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb("Not an image! Please upload only images.", false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

module.exports = upload;
