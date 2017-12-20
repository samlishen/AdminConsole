const express = require('express');
const request = require('request');
const requestp = require('request-promise-native');

const router = express.Router();

const VM = require('../DataAccess/VM');
const Node = require('../DataAccess/Node');
const Restaurant = require('../DataAccess/Restaurant');
const Version = require('../DataAccess/Version');

router.get('/', async (req, res) => {
    var vms = await VM.findAll({
        attributes: ['id', 'vmName', 'ipAddress'],
        include: [{
            model: Node,
            include: [Restaurant]
        }]
    });
    console.log(JSON.stringify(vms));

    for (var i = 0; i < vms.length; i++) {
        let vm = vms[i];
        console.log(JSON.stringify(vm));
        for (var j = 0; j < vm.Nodes.length; j++) {
            var node = vm.Nodes[j].dataValues;
            let options = {
                method: 'POST',
                uri: `${vm.ipAddress}:${node.port}/git`,
                headers: {
                    'authorization': 'abcd+1234'
                },
                body: {
                    command: 'rev-parse',
                    args: 'HEAD'
                },
                json: true
            };

            await requestp.post(options)
                .then((body) => {
                    console.log(body);
                    vms[i].Nodes[j].dataValues.version = body;
                })
        }
    }

    if (vms) {
        res.status(200).send(vms);
    } else {
        res.status(404).send();
    }
});

router.post('/usage', async (req, res) => {
    const requestBody = req.body;

    var url;

    if (!requestBody || !requestBody.vmName && !requestBody.ipAddress) {
        res.status(404).send();
        return;
    } else if (requestBody.ipAddress) {
        url = `${requestBody.ipAddress}:3000/api/vm/usage`;
    } else {
        var ipAddress = await VM.findOne({
            where: {
                vmName: requestBody.vmName
            }
        }).ipAddress;

        if (ipAddress) {
            url = `${ipAddress}:3000/api/vm/usage`;
        } else {
            res.status(404).send();
            return;
        }
    }

    const option = {
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    };

    var response = {};
    var cb = new Promise((resolve, reject) => {
        request(option, (err, res, body) => {
            if (err) {
                console.log(err);
                response.status = 404;
                reject();
            }
            else {
                response.status = 200;
                response.body = body;
                resolve();
            }
        })
    });
    await cb;

    res.status(response.status).send(response.body);
});

module.exports = router;