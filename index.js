const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hb4zl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const todoList = client.db("mern-todo").collection("todo");
    const completedList = client.db("mern-todo").collection("completed");

    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = todoList.find(query);
      const todo = await cursor.toArray();
      res.send(todo);
    });

    app.get('/todo/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await todoList.findOne(query);
      res.send(result);
  });

    app.get("/completed", async (req, res) => {
      const query = {};
      const cursor = completedList.find(query);
      const completed = await cursor.toArray();
      res.send(completed);
    });

    app.post("/todo", async (req, res) => {
      const newTodo = req.body;
      console.log("adding new Item", newTodo);
      const result = await todoList.insertOne(newTodo);
      res.send(result);
    });

    app.post("/completed", async (req, res) => {
      const newCompleted = req.body;
      console.log("adding new Item", newCompleted);
      const result = await completedList.insertOne(newCompleted);
      res.send(result);
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log("deleting Item", id);
      const result = await todoList.deleteOne(query);
      res.send(result);
    });
  } catch (e) {
    console.error(e);
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running CRUD server!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
