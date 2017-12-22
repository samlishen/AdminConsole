// NPM dependency
const express = require('express');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');

// Local dependency
const API_Node = require('./API/API_Node');
const API_Version = require('./API/API_Version');
const endpointConfig = require('./Config/Endpoint');

// Local variables
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Logging middleware
app.use((req, res, next) =>
{
    console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log();
    next();
});

// Options middleware
app.use((req, res, next) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Max-Age", 86400);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
    if (req.method == 'OPTIONS')
    {
        res.status(HttpStatus.OK).send();
        return;
    }

    next();
});

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

app.use('/api/nodes', API_Node);
app.use('/api/versions', API_Version);

app.use((req, res, next) =>
{
    console.log(`${new Date().toISOString()}: ${res.statusCode} ${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(res._headers)}`);
    console.log();
    next();
});

// Start listening
app.listen(3001);
console.log('Start listening on port 3001');

