// NPM Dependencies
const express = require('express');
const request = require('request-promise-native');
const HttpStatus = require('http-status-codes');

// Local Dependencies
const nodes = require('../Config/Nodes');

// Local Variable
const router = express.Router();

router.get('/', (req, res) =>
{
    nodes.Nodes.forEach(async (node) => {
        let options = {
            url: `${node.serviceDnsName}:${node.port}/monitor/lastRequest`,
            headers: {
                "authorization": "AbCd+1234"
            }
        };

        const lastRequest = request.get(options)
            .then((body) =>
            {
                node.lastRequest = body.lastRequest;
            });

        options = {
            url: `${node.serviceDnsName}:${node.port}/git`,
            body: {
                command: 'rev-parse',
                args: 'HEAD'
            },
            headers: {
                "authorization": "AbCd+1234"
            }
        };

        const version = request.post(options)
            .then((body) =>
            {
                node.version = body.version;
            });

        await lastRequest;
        await version;
    });

    res.status(HttpStatus.OK).send(nodes.Nodes);
});

module.exports = router;