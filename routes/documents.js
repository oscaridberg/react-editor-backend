var express = require('express');
var router = express.Router();
const dbModel = require('../modules/dbModel.js');
// const db = require('../db/src/search.js');

// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";


// GET documents in database.
router.get("/", async (request, response) => {
    try {
        let res = await dbModel.findInCollection(dsn, "crowd", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

router.post("/:title/:content", async (request, response) => {

    try {
        let res = await dbModel.addToCollection(dsn, "crowd", request.params.title, request.params.content);

        console.log(res);
        response.status(201).json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
})

// PUT route for /documents
router.put("/", (req, res) => {
    res.status(204).json({
        data: {
            msg: "Got a PUT request"
        }
    });
})

// DELETE route for /documents
router.delete("/", (req, res) => {
    res.status(204).json({
        data: {
            msg: "Got a DELETE request"
        }
    })
});


module.exports = router;
