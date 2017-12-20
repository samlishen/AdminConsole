const express = require('express');
const request = require('request');

const router = express.Router();
var gitConfig = require('../Config/Git');

router.post('/', async (req, res) => {
    let since = req.body.since;
    let until = req.body.until;

    let url = `${gitConfig.GitRepositoryEndpoint}${gitConfig.OwnerName}${gitConfig.RepositoryName}/commits`;
    if (since || until) {
        url += `?`;
        if (since) {
            url += `since=${since}`;
            if (until) {
                url += `&`;
            }
        }

        if (until) {
            url += `until=${until}`;
        }
    }

    let option = {
        url: url,
        method: 'GET',
        headers: {
            'authorization': `token ${gitConfig.AuthenticationToken}`,
            'user-agent': 'AdminConsole'
        }
    };

    var response = {};

    console.log(JSON.stringify(option));

    let promise = new Promise((resolve, reject) => {
        request(option, (err, res, body) => {
            if (err) {
                response.status = 400;
                reject();
            } else {
                response.status = res.statusCode;
                response.body = body;
                resolve();
            }
        })
    })

    await promise;

    res.status(response.status).send(response.body);
    return;
});

module.exports = router;