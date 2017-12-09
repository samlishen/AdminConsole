const express = require('express');

const router = express.Router();
var versionDb = require('../DataAccess/Version');

router.get('/', async (req, res) => {
    var versions = await versionDb.findAll({
        attributes: ['id', ['commitHash', 'hash'], ['commitMessage', 'message']]
    });
    if (versions) {
        res.status(200).send(versions);
    } else {
        res.status(404).send();
    }
});

// router.post('/', async (req, res) => {
//     var mode = req.body.mode;
//
//     if (!mode) {
//         res.status(400).send();
//         return;
//     }
//
//     switch (mode) {
//         case "update":
//
//     }
// })

module.exports = router;