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

module.exports = router;