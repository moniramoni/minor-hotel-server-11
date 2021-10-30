// require express, mongodb, objectId, cors, dotenv
const express = require('express');
const { MongoClient } =require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require("body-parser");

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// database access credentials & secure from .env file  & client create
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hpa1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })


// async function
async function run() {
    try{
        await client.connect();
        const ServicesCollection = client.db("minorHotel").collection("services");
        const orderCollection = client.db("minorHotel").collection("orders");

        // add services
        app.post("/addServices", async (req, res) => {
            console.log(req.body);
            const result = await ServicesCollection.insertOne(req.body);
            console.log(result);
        });

        // get services
        app.get("/addServices", async (req, res) => {
            const cursor = ServicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });

        // get singleService
        app.get("/singleService/:id", (req, res) => {
            console.log(req.params.id);
            ServicesCollection
            .findOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result)
            })
        });

        // add myOrder 
        app.post('/myOrder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            res.send(result)
        })

        // get manageOrders
        app.get("/manageOrders", async (req, res) => {
            const cursor = orderCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });

        // get myOrder
        app.get("/myOrder/:email", async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({ email }).toArray();
            res.send(result);
        });


    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);


// default route api create for checking
app.get('/', (req,res) => {
    res.send('hello node moni is here')
})

app.listen(port, () => {
    console.log('running port on port', port)
})



/*
-----------------------------------------
SETUP FOR CLIENT SERVER
-----------------------------------------

one time:
1. nodemon globally install
2. mongodb atlas user, access
3. Network access (ip address allow)

Every projects:
1. install mongodb, express, cors, dotenv
2. basic 5 step setup from node express
3. import (require), mongodb
4. copy uri (connection string)
5. create the client (copy code from atlas)
6. Create or get database access credentials (username, password)
7. create .env file and add DB_USER and DB_PASS as environment variable
8. Make sure you require (import) dotenv
9. Convert URI string to a template string.
10. Add DB_USER and DB_PASS in the connection URI string.
11. Check URI string by using console.log
12. Create async function run and call it by using run().catch(console.dir)
13. add try and finally inside the run function.
14. comment out await client.close() to keep the connection alive
15. add await client.connect(); inside the try block
16. use a console.log after the client.connect to ensure database is connected
*/




/*

-----------------------------------------
HOST SERVER TO HEROKU
-----------------------------------------

one time:
1. heroku account open
2. Heroku software install

Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script:  "start": "node index.js",
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
----
update:
1. save everything check locally
2. git add, git commit-m", git push
2. git push heroku main
*/
