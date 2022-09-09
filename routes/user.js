var express = require('express');
var router = express.Router();
// const db = require('../db/src/search.js');


// GET route for /user
router.get("/", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request",
        }
    });

})

// POST route for /user
router.post("/", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request"
        }
    });
})

// PUT route for /user
router.put("/", (req, res) => {
    res.status(204).json({
        data: {
            msg: "Got a PUT request"
        }
    });
})

// DELETE route for /user
router.delete("/", (req, res) => {
    res.status(204).json({
        data: {
            msg: "Got a DELETE request"
        }
    })
});

module.exports = router;
