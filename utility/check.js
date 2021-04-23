const fetch = require("node-fetch");

let data = [
  { _id: "605b305dceda412fa47e23ef", type: "joggers" },
  { _id: "605b305dceda412fa47e23f0", type: "asooke" },
  { _id: "605b305dceda412fa47e23f1", type: "joggers" },
  { _id: "605b305dceda412fa47e23f2", type: "joggers" },
  { _id: "605b305dceda412fa47e23ef", type: "asooke" },
  { _id: "605b305dceda412fa47e23f0", type: "joggers" },
  { _id: "605b305dceda412fa47e23f1", type: "asooke" },
  { _id: "605b305dceda412fa47e23f2", type: "joggers" },
];

let arr = [
  "https://jsonplaceholder.typicode.com/users/1",
  "https://jsonplaceholder.typicode.com/users/1",
  "https://jsonplaceholder.typicode.com/users/1",
];
let Joggers = data.filter((el) => el.type === "joggers");
let Asooke = data.filter((el) => el.type === "asooke");

async function fetchMoviesJSON(url) {
  const response = await fetch(url);
  const movies = await response.json();
  return movies;
}

// arr.forEach(val => {

// })

const promises = [];

let joggersLength = 3; //3
let asookeLength = 4; //4
let loopLength = joggersLength + asookeLength; //7

for (let i = 1; i <= loopLength; i++) {
  if (i <= joggersLength) {
    promises.push("its jogger");
    // Jogger.findById(joggers[0]._id, (err, data) => {
    //     if (err) return res.send(err);
    //     res.send(data);
    //   })
  } else {
    promises.push("its asooke");
    // Asooke.findById(joggers[0]._id, (err, data) => {
    //     if (err) return res.send(err);
    //     res.send(data);
    //   })
  }
}

// for (let i = 1; i <= 3; i++) {
//   //   console.log(`https://jsonplaceholder.typicode.com/users/${i}`);
//   promises.push(
//     fetchMoviesJSON(`https://jsonplaceholder.typicode.com/users/${i}`).then(
//       (mv) => {
//         return mv;
//       }
//     )
//   );
// }

console.log(promises);

// Promise.allSettled(promises).then((results) =>
//   results.forEach((result) => console.log(result))
// );
