var express = require('express');
var router = express.Router();
const dbModel = require('../modules/dbModel.js');
const { application } = require('express');
const authModel = require('../modules/authModel.js');
const mongo = require("mongodb").MongoClient;

// const db = require('../db/src/search.js');

// MongoDB
let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.zoy1g8s.mongodb.net/?retryWrites=true&w=majority`;



// GET documents in database.
router.get("/",
(req, res, next) => authModel.checkToken(req, res, next), 
async (request, response) => {
    try {
        let res = await dbModel.findInCollection("documents", {}, {}, 0);
        // console.log(res);
        response.json(res);
    } catch (err) {
        // console.log(err);
        response.json(err);
    }
});

router.post("/", 
(req, res, next) => authModel.checkToken(req, res, next), 
async (request, response) => {
    try {
        let res = await dbModel.addToCollection("documents", request.body.title, request.body.content, request.body.user);

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
