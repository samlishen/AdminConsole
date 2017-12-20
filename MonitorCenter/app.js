// NPM dependency
const express = require('express');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');

// Local dependency
const API_VM = require('./API/API_VM');
const API_Node = require('./API/API_Node');
const API_Version = require('./API/API_Version');
const endpointConfig = require('./Config/Endpoint');

// Local variables
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Authorization middleware
app.use((req, res, next) =>
{
    let authorizationToken = req.headers.authorization;

    if (!authorizationToken)
    {
        res.setHeader("Www-authorization", "token");
        res.status(HttpStatus.FORBIDDEN).send();
        return;
    }

    if (authorizationToken != endpointConfig.AuthorizationToken)
    {
        res.status(HttpStatus.UNAUTHORIZED).send();
        return;
    }

    next();
});

// Logging middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    next();
});

// Routing
app.get('/', (req, res) => {
    res.status(200).send('OK')
});

app.use('/api/vm', API_VM);
app.use('/api/node', API_Node);
app.use('/api/version', API_Version);

// Start listening
app.listen(3001);

