const cmd = require('child_process');

var run = (command, callback) => {
    return cmd.exec(command, (error, stdout, stderr) => {
        if (err)
    });
}

run('ls', ());