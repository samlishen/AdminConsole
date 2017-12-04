// NPM dependency
const express = require('express');
const bodyParser = require('body-parser');

// Local dependency
const API_VM = require('./API/API_VM');
const API_Node = require('./API/API_Node');

// Local variables
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toString()}: ${req.method} ${req.url}`);
    console.log(req.body);
    next();
});

// Routing
app.get('/', (req, res) => {
    res.status(200).send('OK')
});

app.use('/api/vm', API_VM);
app.use('/api/node', API_Node);

// Start listening
app.listen(3001);

