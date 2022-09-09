const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const index = require('./routes/index');
const hello = require('./routes/hello');
const user = require('./routes/user');
const port = 1337;

// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/mumin";

app.get("/list", async (request, response) => {
    try {
        let res = await findInCollection(dsn, "crowd", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});


app.use(cors());


// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
})

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Routes for index
app.use('/', index);

//Routes for /hello
app.use('/hello', hello);

//Routes for /user
app.use('/user', user);


// Add routes for 404 and error handling
// Catch 404 and forward to error handler.
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message, 
                "detail": err.message
            }
        ]
    });
});


// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));


/**
  * Find documents in an collection by matching search criteria.
  *
  * @async
  *
  * @param {string} dsn        DSN to connect to database.
  * @param {string} colName    Name of collection.
  * @param {object} criteria   Search criteria.
  * @param {object} projection What to project in results.
  * @param {number} limit      Limit the number of documents to retrieve.
  *
  * @throws Error when database operation fails.
  *
  * @return {Promise<array>} The resultset as an array.
  */
 async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}
