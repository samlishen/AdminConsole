const fs = require('fs');
const usage = require('pidusage');
const cmd = require('node-cmd');
const HashSet = require('hashset');
const terminate = require('terminate');

const config = require('../config');
const versionHashSet = new HashSet();

var Create = async (restaurantName, port, currentVersionHash) => {
    var directory = `${config.git.defaultFolder}\\${currentVersionHash}`;

    if (!fs.existsSync(directory)) {
        console.log('Cannot find such directory');
        fs.mkdirSync(directory);

        var clone = new Promise((resolve, reject) => {
            cmd.get(`git clone ${config.git.gitRepositoryUrl} ${directory}`, (err, data, stderr) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data);
                }
            })
        }).catch(reason => { return undefined });
        await clone;

        console.log('Clone done');

        var checkout = new Promise((resolve, reject) => {
            cmd.get(`cd ${directory} && git checkout ${currentVersionHash}`, (err, data, stderr) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data);
                }
            })
        }).catch(reason => { return undefined });
        await checkout;

        console.log('Checkout done');

        var npmInstall = new Promise((resolve, reject) => {
            cmd.get(`npm install`, (err, data, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        }).catch(reason => { return undefined });
        await npmInstall;

        console.log('Npm install done');
    }

    var process = cmd.run(`node ${config.git.defaultFolder}\\${currentVersionHash}\\app.js --port ${port} --restaurant ${restaurantName}`);
    var pid = process.pid;

    versionHashSet.add(pid);

    return {
        restaurantName: restaurantName,
        port: port,
        pid: pid,
        versionHash: currentVersionHash
    }
};

var Shutdown = async (pid) => {
    if (!versionHashSet.contains(pid)) {
        return undefined;
    }

    terminate(pid, (err) => {
        if (err) {
            return undefined;
        }
    });
    versionHashSet.remove(pid);
    return `${pid} is terminated`;
}

var GetUsage = (pid) => {
    return getUsage(pid)
};

var getUsage = async (pid) => {
    var retVal;
    var cb = new Promise((resolve, reject) => {
        usage.stat(pid, {advance: true}, (err, stat) => {
            if (err) {
                retVal = undefined;
            } else {
                retVal = {
                    cpuUsage: stat.cpu,
                    memoryUsage: stat.memory
                };
            }
            resolve();
        });
    });
    await cb;
    return retVal;
};

module.exports = {
    GetUsage: GetUsage,
    Create: Create,
    Shutdown: Shutdown
};
