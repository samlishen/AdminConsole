const express = require('express');

const vmMonitor = require('../BusinessLogic/VMMonitor');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('VM OK');
});

router.get('/usage', (req, res) => {
    res.status(200).send(vmMonitor.GetUsage());
});

router.get('/usage/cpu', (req, res) => {
    res.status(200).send(vmMonitor.GetCpuUsage());
});

router.get('/usage/memory', (req, res) => {
    res.status(200).send(vmMonitor.GetMemoryUsage());
});

module.exports = router;