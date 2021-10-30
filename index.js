const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nebgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();

      // connection check
      const database = client.db("tour_and_travels");
      const packagesCollection = database.collection("packages");
      const serviceCollection = database.collection("services");
      const galleryCollection = database.collection("gallery");
      const orderCollection = database.collection("orders");
      console.log("connected to db");

      // packages: GET API
      app.get("/packages", async (req, res) => {
         const cursor = packagesCollection.find({});
         const packages = await cursor.toArray();
         res.send(packages);
      });
      // get single package
      app.get("/packages/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const package = await packagesCollection.findOne(query);
         res.json(package);
      });

      // services: GET API
      app.get("/services", async (req, res) => {
         const cursor = serviceCollection.find({});
         const services = await cursor.toArray();
         res.send(services);
      });
      // get single service

      // gallery: GET API
      app.get("/gallery", async (req, res) => {
         const cursor = galleryCollection.find({});
         const gallery = await cursor.toArray();
         res.send(gallery);
      });
      // get single gallery

      // gallery: GET API
      app.get("/orders", async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // package: POST API
      app.post("/packages", async (req, res) => {
         const newPackage = req.body;
         const result = await packagesCollection.insertOne(newPackage);
         console.log("got new package", req.body);
         console.log("added package", result);
         res.json(result);
      });
      // service: POST API
      app.post("/services", async (req, res) => {
         const newService = req.body;
         const result = await serviceCollection.insertOne(newService);
         console.log("got new package", req.body);
         console.log("added package", result);
         res.json(result);
      });
      // gallery: POST API
      app.post("/gallery", async (req, res) => {
         const newPhoto = req.body;
         const result = await galleryCollection.insertOne(newPhoto);
         console.log("got new package", req.body);
         console.log("added package", result);
         res.json(result);
      });
      // order: POST API
      app.post("/orders", async (req, res) => {
         const newOrder = req.body;
         const result = await orderCollection.insertOne(newOrder);
         console.log("got new package", req.body);
         console.log("added package", result);
         res.json(result);
      });

      // package: DELETE API
      app.delete("/orders/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await orderCollection.deleteOne(query);
         console.log("deleted result", result);
         res.json(result);
      });

      // orders: PUT API
      app.put("/orders/:id", async (req, res) => {
         const id = req.params.id;
         const updateOrder = req.body;
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               status: updateOrder.status,
            },
         };
         const result = await orderCollection.updateOne(
            filter,
            updateDoc,
            options
         );
         console.log("updating order status", req.body);
         res.json(result);
      });
   } finally {
      // await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("tour and travels server running");
});

app.listen(port, () => {
   console.log("tour and travels server running on port", port);
});
