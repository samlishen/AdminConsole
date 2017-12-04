const express = require('express');

const nodeMonitor = require('../BusinessLogic/NodeMonitor');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Node OK');
});

router.post('/', async (req, res) => {
    var body = req.body;
    if (body.restaurantName && body.port && body.versionHash) {
        var retVal = await nodeMonitor.Create(body.restaurantName, body.port, body.versionHash);
        if (retVal) {
            res.status(200).send(retVal);
            return;
        }
    }
    res.status(400).send();
});

router.put('/', async (req, res) => {
    var body = req.body;
    if (body.restaurantName && body.port && body.versionHash && body.pid) {
        var retVal = await nodeMonitor.Shutdown(body.pid);

        if (retVal) {
            retVal = await nodeMonitor.Create(body.restaurantName, body.port, body.versionHash);
            if (retVal) {
                res.status(200).send(retVal);
                return;
            }
        }
    }
    res.status(400).send();
})

router.delete('/', async (req, res) => {
    var pid = req.body.pid;
    if (pid) {
        var retVal = await nodeMonitor.Shutdown(pid);
        if (retVal) {
            res.status(200).send(retVal);
            return;
        }
    }
    res.status(404).send();
})

router.post('/usage', async (req, res) => {
    var body = req.body;
    var pid = body.pid;

    var retVal = await nodeMonitor.GetUsage(pid);
    if (retVal) {
        res.status(200).send(retVal);
    } else {
        res.status(404).send();
    }
});

module.exports = router;