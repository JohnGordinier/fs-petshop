import fs from "fs";
import express from "express";

const app = express();
const port = 8000;
app.use(express.json());

// let petsData;

// const loadPetsData = () => {
//   return fs.promises //apparently, you need to use this for asynchronous code
//     .readFile("../pets.json", "utf-8")
//     .then((text) => {
//       petsData = JSON.parse(text);
//       console.log(petsData);
//     })
//     .catch((error) => {
//       console.error("Error loading pets data:", error);
//       process.exit(1);
//     });
// };

// loadPetsData().then(() => {
//   app.get("/pets", (req, res) => {
//     res.json(petsData);
//   });

//   app.get("/pets/:id", (req, res) => {
//     const petId = req.params.id;
//     const indexNum = Number.parseInt(petId);

//     if (
//       !Number.isInteger(indexNum) ||
//       Number.isNaN(indexNum) ||
//       indexNum < 0 ||
//       indexNum >= petsData.length
//     ) {
//       return res.status(400).json({ error: "Invalid pet ID" });
//     }

//     const pet = petsData[indexNum];
//     res.json(pet);
//   });

//   app.listen(port, () => {
//     console.log("Server is listening on port", port);
//   });
// });

const loadPetsData = () => {
  return fs.promises
    .readFile("../pets.json", "utf-8")
    .then((text) => {
      return JSON.parse(text);
    })
    .catch((error) => {
      console.error("Error loading pets data:", error);
      process.exit(1);
    });
};

app.get("/pets", (req, res) => {
  loadPetsData()
    .then((petsData) => {
      res.json(petsData);
      console.log("Here is a list of all pets. ", petsData);
    })
    .catch((error) => {
      console.error("Error reading pets data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/pets/:id", (req, res) => {
  const petId = req.params.id;

  loadPetsData()
    .then((petsData) => {
      const indexNum = Number.parseInt(petId);

      if (
        !Number.isInteger(indexNum) ||
        Number.isNaN(indexNum) ||
        indexNum < 0 ||
        indexNum >= petsData.length
      ) {
        return res.status(400).json({ error: "Invalid pet ID" });
      }

      const pet = petsData[indexNum];
      console.log("Here's the pet your inquiring: ", pet);
      res.json(pet);
    })
    .catch((error) => {
      console.error("Error reading pets data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// endpoint to create a new pet
app.post("/pets", (req, res) => {
  // console.log("req.body", req.body);
  const age = Number.parseInt(req.body.age); // make sure its a number
  const kind = req.body.kind;
  const name = req.body.name;
  // validate data from request body
  if (!kind || !name || Number.isNaN(age)) {
    return res.sendStatus(404);
  }
  // create a new pet object
  const newPet = {
    age: age,
    name: name,
    kind: kind,
  };
  console.log("newPet", newPet);
  // add to pets.json
  fs.readFile("../pets.json", "utf-8", (err, text) => {
    // read in pets.json
    if (err) {
      // send client internal sever error
      console.error(err.stack);
      res.sendStatus(500);
      return;
    }
    // parse text into json
    const pets = JSON.parse(text);
    // add new pet
    pets.push(newPet);
    // write pets to pets.json
    fs.writeFile("../pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        // send client internal sever error
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      res.statusCode = 201;
      res.send(newPet);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
