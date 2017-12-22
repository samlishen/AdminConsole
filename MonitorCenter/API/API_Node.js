// NPM Dependencies
const express = require('express');
const request = require('request-promise-native');
const HttpStatus = require('http-status-codes');
const Linq = require('node-linq').LINQ;

// Local Dependencies
const nodes = require('../Config/Nodes');
const gitConfig = require('../Config/Git');

// Local Variable
const router = express.Router();

router.get('/', async (req, res, next) =>
{
    for (var i = 0; i < nodes.Nodes.length; i++)
    {
        let node = nodes.Nodes[i];
        let options = {
            url: `${node.serviceDnsName}:${node.port}/monitor/lastRequest`,
            headers: {
                "authorization": "abcd+1234"
            }
        };

        await request.get(options)
            .then((body) =>
            {
                node.lastRequest = body.lastRequest;
            })
            .catch((err) =>
            {

            });

        options = {
            url: `${node.serviceDnsName}:${node.port}/git`,
            body: {
                command: 'rev-parse',
                args: 'HEAD'
            },
            headers: {
                "authorization": "abcd+1234",
                "Content-Type": "application/json"
            },
            json: true
        };

        await request.post(options)
            .then((body) =>
            {
                node.version = body;
            })
            .catch((err) =>
            {

            });

        options = {
            url: `${gitConfig.GitRepositoryEndpoint}${gitConfig.OwnerName}${gitConfig.RepositoryName}/commits/${node.version}`,
            headers: {
                'authorization': `token ${gitConfig.AuthenticationToken}`,
                'user-agent': 'AdminConsole'
            }
        };

        await request.get(options)
            .then((body) =>
            {
                node.version = JSON.parse(body).commit.message;
            })
            .catch((err) =>
            {

            });
    }

    res.status(HttpStatus.OK).send(nodes.Nodes);
    next();
});

router.post('/', async (req, res) =>
{
    const mode = req.body.mode;
    const id = req.body.id;
    const commitHash = req.body.commitHash;

    var node;
    var options;

    switch (mode)
    {
        case "update":
            node = new Linq(nodes.Nodes)
                .Where((node) =>
                {
                    return node.id == id;
                })
                .FirstOrDefault();

            if (!node)
            {
                res.status(HttpStatus.NOT_FOUND).send();
                return;
            }

            options = {
                url: `${node.serviceDnsName}:${node.port}/git`,
                headers: {
                    "authorization": "abcd+1234"
                },
                body: {
                    command: 'checkout',
                    args: `-f ${commitHash}`
                },
                json: true
            };

            await request.post(options)
                .then((body) =>
                {
                    res.status(HttpStatus.OK).send(body);
                })
                .catch((err) =>
                {
                    res.status(err.statusCode).send(err.body);
                });

            return;
        case "restart":
            node = new Linq(nodes.Nodes)
                .Where((node) =>
                {
                    return node.id == id;
                })
                .FirstOrDefault();

            if (!node)
            {
                res.status(HttpStatus.NOT_FOUND).send();
                return;
            }

            options = {
                url: `${node.serviceDnsName}:${node.port}/git`,
                headers: {
                    "authorization": "abcd+1234"
                },
                body: {
                    command: 'shutdown'
                },
                json: true
            };

            console.log(options);

            await request.post(options)
                .then((body) =>
                {
                    var retVal = {
                        Message: body
                    }

                    res.status(HttpStatus.OK).send(retVal);
                })
                .catch((err) =>
                {
                    res.status(err.statusCode).send(err.body);
                });

            return;
        default:
            res.status(404).send('{"Error" : "Command Not Found"}');
            return;
    }
});

var RetrieveNodeWithId = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        var retVal = new Linq(nodes.Nodes)
            .Where((node) =>
            {
                return node.id == id;
            })
            .FirstOrDefault();
        resolve(retVal);
    });
};

module.exports = router;