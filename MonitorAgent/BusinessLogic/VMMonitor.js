const os = require('os');

var GetUsage = () => {
    return {
        cpuUsage: GetCpuUsage(),
        memoryUsage: GetMemoryUsage()
    }
};

var GetCpuUsage = () => {
    var cpus = os.cpus();
    var retVals = [];

    for(var i = 0, len = cpus.length; i < len; i++) {
        var retVal = {};
        var cpu = cpus[i], total = 0;

        for(var type in cpu.times) {
            total += cpu.times[type];
        }

        for(type in cpu.times) {
            retVal[type] = Math.round(100 * cpu.times[type] / total);
        }

        retVals.push(retVal);
    }

    return retVals;
};

var GetMemoryUsage = () => {
    return {
        usedMemory: os.totalmem() - os.freemem(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem()
    }
};

module.exports = {
    GetUsage: GetUsage,
    GetCpuUsage: GetCpuUsage,
    GetMemoryUsage: GetMemoryUsage
};