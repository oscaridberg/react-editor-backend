var express = require('express');
var router = express.Router();
const dbModel = require('../modules/dbModel.js');
const { application } = require('express');
const mongo = require("mongodb").MongoClient;
const authModel = require('../modules/authModel');

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.zoy1g8s.mongodb.net/?retryWrites=true&w=majority`;


router.post('/register', async (req, res) => {
    try {
        const body = {
            'email': req.body.email,
            'password': req.body.password
        };
       await authModel.register(res, body);

    } catch (err) {
        console.log(err);
        res.json(err);
    }


});

router.post('/login', async (req, res) => {
    try {
        const body = {
            'email': req.body.email,
            'password': req.body.password
        };
       await authModel.login(res, body);

    } catch (err) {
        console.log(err);
        res.json(err);
    }


});

module.exports = router;