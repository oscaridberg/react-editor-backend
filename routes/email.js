var express = require('express');
var router = express.Router();
const { application } = require('express');
const emailModel = require('../modules/emailModel');
const authModel = require('../modules/emailModel');


const auth = {
    auth: {
        api_key: 'Add own api key',
        domain: 'Add own domain name'
    }
};

router.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.status(200).json(data);

});

router.post("/", async (req, res) => {
    // const data = {
    //     data: {
    //         msg: "Hello World"
    //     }
    // };

    const body = {
        'email': req.body.email,
    };
    await emailModel.sendEmail(res, body);

    return res.status(201);
    
});


module.exports = router;
