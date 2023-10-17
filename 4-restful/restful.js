import express from "express";
import pg from "pg";

const client = new pg.Client({
  database: "petshop",
});

await client.connect();
console.log("Connected to the database");

//THIS QUERY WILL SORT THE PETS ALPHABETICALLY BY NAME
const result = await client.query("SELECT * FROM pets ORDER BY name");
console.log("Query result:", result.rows);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

//TO GET A LIST OF ALL THE PETS IN THE DATABASE
app.get("/pets", async (req, res) => {
  try {
    //THE GET QUERY WILL PUT THE PETS IN ORDER BY NAME
    const result = await client.query("SELECT * FROM pets ORDER BY name");

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//TO QUERY A CERTAIN PET IN THE DATABASE BY PED ID
app.get("/pets/:id", async (req, res) => {
  const petId = req.params.id;

  try {
    // Fetch the pet by ID
    const result = await client.query("SELECT * FROM pets WHERE id = $1", [
      petId,
    ]);

    // Check if any rows were returned
    if (result.rows.length === 0) {
      // Send 404 status and JSON with error message
      return res.status(404).json({ error: "Pet not found" });
    }

    // Send the query result as JSON
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching pet:", error);
    // Send 500 status and JSON with error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//TO PUT A NEW PET INTO THE DATABASE
app.post("/pets", async (req, res) => {
  const age = Number.parseInt(req.body.age);
  const kind = req.body.kind;
  const name = req.body.name;

  // Validate input
  if (!kind || !name || Number.isNaN(age)) {
    console.log("Error, not a valid input. Try again.");
    return res.sendStatus(400);
  }

  try {
    //THIS QUERY WILL RETURN THE INFORMATION BACK TO THEM INCLUDING THE NEW PET ID
    const result = await client.query(
      "INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3) RETURNING *",
      [age, kind, name]
    );

    // The result.rows[0] now contains the new pet details, including the ID
    const newPet = result.rows[0];

    // Send the inserted pet as JSON, including the ID
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//TO MAKE A CHANGE TO A PET'S INFORMATION IN THE DATABASE
app.put("/pets/:id", async (req, res) => {
  const petId = req.params.id;
  const age = Number.parseInt(req.body.age);
  const kind = req.body.kind;
  const name = req.body.name;
  // Validate input
  if (!kind || !name || Number.isNaN(age)) {
    console.log("Error: Invalid input");
    return res.sendStatus(400);
  }
  try {
    // Check if any rows were affected
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Pet not found" });
    } else {
      // Send the updated pet as JSON
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//TO DELETE A PET FROM THE DATABASE
app.delete("/pets/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Check if any rows were affected
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Pet not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PORT IS LISTENING FOR A REQUEST
app.listen(8000, () => {
  console.log("listening on port 8000");
});
