const mongoose = require("mongoose");
const path = require("path");
const grid = require("gridfs-stream");
const fs = require("fs");

const filesrc = path.join(__dirname, "../filestoread/videoplayback.mp4");

const connection = mongoose.connection;

function sendImageToDb() {
  console.log("filesrc", filesrc);
  let imageUrlArr = filesrc.split("\\");
  let imageName = imageUrlArr[imageUrlArr.length - 1];

  grid.mongo = mongoose.mongo;

  connection.once("open", () => {
    //Open the connection and write file

    var gridfs = grid(connection.db);
    if (gridfs) {
      // Create a stream for storing file in database
      const streamwrite = gridfs.createWriteStream({
        filename: imageName,
      });
      // pipe into the database from read stream
      fs.createReadStream(filesrc).pipe(streamwrite);

      // Complete the write operation
      streamwrite.on("close", (file) => {
        console.log("write written successfully in database", file);
      });
    } else {
      console.log("Sorry No Grid FS Object");
    }
  });
}

// function sendImageToDb() {
//   // Establish connection between Mongo and GridFs
//   // console.log(sendImageToDb);
//   // sendImageToDb();

//   grid.mongo = mongoose.mongo;

//   connection.once("open", () => {
//     //Open the connection and write file

//     var gridfs = grid(connection.db);
//     if (gridfs) {
//       // Create a stream for storing file in database
//       const fsstreamwrite = fs.createWriteStream(
//         path.join(__dirname, "./filestowrite/logo.png")
//       );
//       // pipe into the database from read stream
//       let readstream = gridfs.createReadStream({
//         filename:
//           "C:\\Users\\User\\Desktop\\E-commerce\\Shopiee_API\\filestoread\\logo3.png",
//       });
//       readstream.pipe(fsstreamwrite);
//       readstream.on("close", (file) => {
//         console.log("File Read Successfully from database");
//       });
//     } else {
//       console.log("Sorry No Grid FS Object");
//     }
//   });
// }

module.exports = sendImageToDb;
