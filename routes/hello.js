var express = require('express');
var router = express.Router();

// GET route for /hello
router.get("/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };
    res.json(data);
})

module.exports = router;