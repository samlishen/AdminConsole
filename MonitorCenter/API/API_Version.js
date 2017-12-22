const express = require('express');
const request = require('request-promise-native');
const orirequest = require('request');
const linkParser = require('parse-link-header');
const HttpStatus = require('http-status-codes');

const router = express.Router();
var gitConfig = require('../Config/Git');

// Known Problem: It seems like there is a upper limit of the number of commits that can be return from git api.
// The number is around 20.
router.post('/commits', async (req, res) =>
{
    let since = req.body.since;
    let until = req.body.until;
    let branch = req.body.branch ? req.body.branch : "master";

    let url = `${gitConfig.GitRepositoryEndpoint}${gitConfig.OwnerName}${gitConfig.RepositoryName}/commits?sha=${branch}`;
    if (since || until) {
        if (since) {
            url += `&since=${since}`;
        }

        if (until) {
            url += `&until=${until}`;
        }
    }

    let option = {
        url: url,
        headers: {
            'authorization': `token ${gitConfig.AuthenticationToken}`,
            'user-agent': 'AdminConsole'
        }
    };

    await request.get(option)
        .then((body) => {
            res.status(HttpStatus.OK).send(body);
        })
        .catch((err) =>
        {
            res.status(err.statusCode).send();
        });

    return;
});

router.get('/branches', async (req, res) =>
{
    var url = `${gitConfig.GitRepositoryEndpoint}${gitConfig.OwnerName}${gitConfig.RepositoryName}/branches`;

    var retVal = {};

    await RetrieveAllGitHubResource(url)
        .then(body =>
        {
            retVal = body;
            res.status(HttpStatus.OK).send(retVal);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(HttpStatus.BAD_REQUEST).send(err);
        });

    return;
});

var RetrieveAllGitHubResource = async (url) =>
{
    let option = {
        method: 'GET',
        headers: {
            'authorization': `token ${gitConfig.AuthenticationToken}`,
            'user-agent': 'AdminConsole'
        }
    };

    var retVal = [];

    while (url)
    {
        var promise = new Promise((resolve, reject) =>
        {
            orirequest(url, option, (err, res, body) =>
            {
                if (err)
                {
                    url = undefined
                    reject();
                }
                else
                {
                    retVal = retVal.concat(JSON.parse(body));

                    if (res.headers.link)
                    {
                        var link = linkParser(res.headers.link);

                        if (link.next)
                        {
                            url = link.next.url;
                        }
                        else
                        {
                            url = undefined;
                        }
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    return retVal;
};

module.exports = router;