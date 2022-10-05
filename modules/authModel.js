const database = require('../db/database.js');
const hat = require('hat');
const validator = require('email-validator');
const mongo = require("mongodb").MongoClient;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const dbModel = require('./dbModel');

const jwtSecret = process.env.JWT_SECRET;

const authModel = {

    // Register new user
    register: async function register(res, body) {

        const email = body.email;
        const password = body.password;

        // Check if email and password are filled out
        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Missing email or password"
                }
            })
        };
        // Check if email is valid
        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Invalid email-adress"
                }
            })
        };
        // Hash password and create user in database.
        bcrypt.hash(password, saltRounds,
            async function (err, hash) {
                if (err){
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            messsage: "Could not hash password"
                        }
                   })
                };

                // Get database
                let db = await database.getDb('users');

                // Insert user into database
                try {
                    const doc = {
                        email: email,
                        password: hash
                    };


                    // Check if user already exists in database.
                    const exists = await dbModel.findUser(email);
                    if (exists.length === 0) {
                        await db.collection.insertOne(doc)

                        return res.status(201).json({
                            message: 'User successfully created'
                        })
                    }
                    
                    // Return error if user already exists.
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: 'User already exists'
                        }
                    })

                } catch (error) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: 'Could not create new user'
                        }
                    })
                } finally {
                    await db.client.close();
                }


            });
    },

    login: async function login (res, body) {
        const email = body.email;
        const password = body.password;

        // Check if email and password are filled out
        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Missing email or password"
                }
            })
        };

        // Try to login user
        try {
            const user = await dbModel.findUser(email);

            if (user) {
                return authModel.comparePasswords(res, user, password);
            }

            return res.status(401).json({
                data: {
                    message: 'User does not exist.'
                }
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    message: 'Could not find user'
                }
            })
        }


    },

    comparePasswords: async function comparePasswords(res, user, password) {
        bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500, 
                        message: "Could not decrypt password."
                    }
                });
            };

            if (result) {
                
                let payload = { email: user[0].email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.status(201).json({
                    data: {
                        _id: user[0]['_id'],
                        email: user[0].email,
                        token: jwtToken

                    }
                })
            }


            return res.status(401).json({
                errors: {
                    status: 401,
                    message: 'Incorrect password'
                }
            })
        })
    },

    checkToken: async function checkToken(req, res, next) {
        let token = req.headers['x-access-token'];
        
        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: 'Failed authentication',
                            detail: err.message
                        }
                    });
                }

            req.user = {};
            req.user.email= decoded.email;
            console.log('passed!');
            return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: 'No token',
                    detail: 'No token in request headers'
                }
            });
        };
    }
};

module.exports = authModel;
