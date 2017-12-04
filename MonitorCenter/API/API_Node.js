const express = require('express');
const request = require('request');

const router = express.Router();
var vmDb = require('../DataAccess/VM');
var restaurantDb = require('../DataAccess/Restaurant');
var nodeDb = require('../DataAccess/Node');
var versionDb = require('../DataAccess/Version');

router.get('/:vmId', async (req, res) => {
    var vmId = req.params.vmId;

    if (vmId) {
        var retVals = await nodeDb.findAll({
            where: {
                VMId: vmId
            }
        });

        res.status(200).send(retVals);
        return;
    }

    res.status(404).send();
});

router.post('/:vmId', async (req, res) => {
    var vmId = req.params.vmId;
    var restaurantId = req.body.restaurantId;
    var port = req.body.port;
    var versionId = req.body.versionId;

    if (vmId && restaurantId && port && versionId) {
        var vm = await vmDb.findOne({
            where: {
                id: vmId
            }
        });
        var restaurant = await restaurantDb.findOne({
            where: {
                id: restaurantId
            }
        });
        var version = await versionDb.findOne({
            where: {
                id: versionId
            }
        });

        if (vm && restaurant && version) {
            var response = {};
            var promise = new Promise((resolve, reject) => {
                const option = {
                    url: `${vm.ipAddress}:3000/api/node`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        restaurantName: restaurant.restaruantName,
                        versionHash: version.commitHash,
                        port: port
                    }
                };
                request(option, (err, res, body) => {
                    console.log(err);
                    console.log(res.statusCode);
                    console.log(body);
                    if (err) {
                        response.status = 400;
                        reject();
                    } else {
                        response.status = 200;
                        response.body = body;
                        resolve();
                    }
                })
            });
            await promise;

            if (response.status == 200) {
                var newNode = await nodeDb.create({
                    port: response.body.port,
                    pid: response.body.pid,
                });
                restaurant.addNode(newNode);
                vm.addNode(newNode);
                version.addNode(newNode);
                response.body.id = newNode.id;
            }

            res.status(response.status).send(response.body);
            return;
        }
        res.status(404).send();
    }
});

router.put('/:vmId/:nodeId', async (req, res) => {
    var vmId = req.params.vmId;
    var nodeId = req.params.nodeId;
    var restaurantId = req.body.restaurantId;
    var port = req.body.port;
    var versionId = req.body.versionId;

    if (vmId && restaurantId && port && versionId) {
        var vm = await vmDb.findOne({
            where: {
                id: vmId
            }
        })
        var node = await nodeDb.findOne({
            where: {
                id: nodeId
            }
        })
        var restaurant = await restaurantDb.findOne({
            where: {
                id: restaurantId
            }
        })
        var version = await versionDb.findOne({
            where: {
                id: versionId
            }
        });
        if (vm && restaurant && node && version) {
            var response = {};
            var promise = new Promise((resolve, reject) => {
                const option = {
                    url: `${vm.ipAddress}:3000/api/node`,
                    method: 'PUT',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        restaurantName: restaurant.restaruantName,
                        versionHash: version.commitHash,
                        port: port,
                        pid: node.pid
                    }
                };

                request(option, (err, res, body) => {
                    console.log(err);
                    console.log(res.statusCode);
                    console.log(body);
                    if (err) {
                        response.status = 400;
                        reject();
                    } else {
                        response.status = 200;
                        response.body = body;
                        resolve();
                    }
                })
            });
            await promise;

            if (response.status == 200) {
                node.port = response.body.port;
                node.pid = response.body.pid;
                await restaurant.addNode(node);
                await version.addNode(node);
                await node.save();
            }
            res.status(response.status).send(response.body);
            return;
        }
        res.status(404).send();
    }
});

router.delete('/:vmId/:nodeId', async(req, res) => {
    var vmId = req.params.vmId;
    var nodeId = req.params.nodeId;

    if (vmId && nodeId) {
        var vm = await vmDb.findOne({
            where: {
                id: vmId
            }
        });
        var node = await nodeDb.findOne({
            where: {
                id: nodeId
            }
        });

        if (vm && node) {
            var response = {};
            var promise = new Promise((resolve, reject) => {
                const option = {
                    url: `${vm.ipAddress}:3000/api/node`,
                    method: 'DELETE',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        pid: node.pid
                    }
                };
                request(option, (err, res, body) => {
                    console.log(err);
                    console.log(res.statusCode);
                    console.log(body);
                    if (err) {
                        response.status = 400;
                        reject();
                    } else {
                        response.status = 200;
                        response.body = body;
                        resolve();
                    }
                })
            });
            await promise;

            if (response.status == 200) {
                node.destroy({force: true});
            }

            res.status(response.status).send(response.body);
            return;
        }
        res.status(404).send();
    }
});

module.exports = router;