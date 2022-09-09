var express = require('express');
var router = express.Router();

// Add a route
router.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);

});

module.exports = router