const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pv5r2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const tasksCollection = client.db('todoapp').collection('tasks');

    app.get('/tasks', async(req, res) => {
      const query ={};
      const cursor = tasksCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    })

    app.delete('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
  })

  app.post('/addtask' ,async(req, res) => {
    const newTask = req.body;
    const result = await tasksCollection.insertOne(newTask);
    res.send(result);
})

app.patch('/task/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const result = await tasksCollection.updateOne(
      query, 
      { $set: { "done": true},
        $currentDate: { lastModified: true } })
  res.send(result);
});

  }
  finally{

  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello SERVER')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})