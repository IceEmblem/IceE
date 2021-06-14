const { start } = require('./start');
const { exec } = require('child_process');

start('native');

// 要执行的 yarn 命令
let yarnCmd = null;
if(process.argv.some(e => e == '-android')){
    yarnCmd = 'yarn android'
}
else if(process.argv.some(e => e == '-ios')){
    yarnCmd = 'yarn ios'
}
else if(process.argv.some(e => e == '-test')){
    yarnCmd = 'yarn test'
}
else{
    yarnCmd = 'yarn start'
}
const cmd = `cd packages/ice-rn-start && ${yarnCmd}`;

// 执行命令
const execCmd = exec(cmd);

execCmd.stdout.on('data', (data) => {
    console.log(data);
});

execCmd.stderr.on('data', (data) => {
    console.error('错误', data);
});

execCmd.on('close', (code) => {
    console.log(`ice-rn-start 已退出，退出码：${code}`);
});