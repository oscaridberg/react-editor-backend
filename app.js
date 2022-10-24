require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const index = require('./routes/index');
const documents = require('./routes/documents');
const auth = require('./routes/auth');
const email = require('./routes/email');
const port = process.env.PORT || 1337;
// const http = require('http');
const dbModel = require('./modules/dbModel.js');
const { graphqlHTTP } = require('express-graphql');



// IO websocket
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        'Access-Control-Allow-Origin': 'https://www.student.bth.se',
    //   origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
  });

io.on('connection', function (socket) {
    socket.on('create', function(room) {
        socket.join(room);
        // console.log(room);
    });

    socket.on("doc", function (data) {
        socket.to(data["_id"]).emit("doc", data);
        // console.log(data.html);
        // Spara till databas och göra annat med data
        async function saveToDb(data) {
            try {
                let res;
                const currentSave = await dbModel.checkIfExists("documents", data.title);

                if (currentSave['content'] != data.html) {
                    res = await dbModel.addToCollection("documents", data.title, data.html, data.authUser);
                }
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }

        
        if (data["title"]) {
            saveToDb(data);
        };
    });

});




app.use(cors());
app.use(bodyParser.json());

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    // console.log(req.method);
    // console.log(req.path);
    next();
})

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Routes for index
app.use('/', index);

// Routes for /user
app.use('/documents', documents);

// Routes for /auth
app.use('/auth', auth);

// Routes for /email
app.use('/email', email);



// Route for GraphQL
const visual = true;

const {
    GraphQLSchema
} = require("graphql");

const RootQueryType = require('./graphql/root.js');

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', graphqlHTTP ({
    schema: schema,
    graphiql: visual
}));

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
// const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
server.listen(port);


module.exports = server;
