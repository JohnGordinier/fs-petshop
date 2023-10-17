// ES6 Modules
import fs from "fs";

const command = process.argv[2];

// if command = read
if (command === "read") {
  // read pets.json
  fs.readFile("../pets.json", "utf-8", function (error, text) {
    // if nodreadFile produces an error, throw it so Node will display the error
    // from teh function vs a syntax error (much more user friendly)
    if (error) {
      throw error;
    }

    // parse json to an object
    const pets = JSON.parse(text);
    // log it to the console
    // console.log(pets);

    const petIndex = process.argv[3];
    if (!petIndex) {
      console.log(pets);
      process.exit(1);
    }
    // console.log("petIndex:", petIndex);
    const indexNum = Number.parseInt(petIndex);

    if (!Number.isInteger(indexNum) || Number.isNaN(indexNum)) {
      console.error("Usage: node fs.js read INDEX");
      process.exit(1);
    }

    if (indexNum < 0 || indexNum >= pets.length) {
      console.error("Usage: node fs.js read INDEX");
      process.exit(1);
    }
    console.log(pets[indexNum]);
  });
  // const num = parseInt(process.argv[pets.length]);

  // if (num >= 0 && num < pets.length) {
  //   console.log(pets[num]);
  // } else {
  //   console.log("Invalid index or command format");
  // }
} else if (command === "create") {
  if (process.argv.length !== 6) {
    console.log("Usage: node fs.js create AGE KIND NAME");
  } else {
    let pet = {
      age: Number(process.argv[3]),
      kind: process.argv[4],
      name: process.argv[5],
    };
    if (Number.isNaN(pet.age)) {
      console.log("Usage: node fs.js create AGE KIND NAME");
      process.exit(1);
    }
    fs.readFile("../pets.json", "utf-8", function (error, text) {
      const pets = JSON.parse(text);
      pets.push(pet);
      fs.writeFile(
        "../pets.json",
        JSON.stringify(pets),
        "utf-8",
        function (err) {
          if (err) {
            throw err;
          }
          console.log("Pet added to system!");
        }
      );
    });
  }
} else {
  console.error("Usage: node fs.js [read | create | update | destroy]");
  process.exit(1);
}
