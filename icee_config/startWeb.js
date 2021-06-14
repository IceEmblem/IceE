const { start } = require('./start');
const { exec } = require('child_process');


start('web');

const cmd = `cd packages/ice-react-start && yarn start`;

const execCmd = exec(cmd);

execCmd.stdout.on('data', (data) => {
    console.log(data);
});

execCmd.stderr.on('data', (data) => {
    console.error('错误', data);
});

execCmd.on('close', (code) => {
    console.log(`ice-react-start 已退出，退出码：${code}`);
});