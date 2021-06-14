const { buildRNModule, watchRNModules, getModules } = require('./module');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs')
const {copyDir, rmdir} = require('./utiliy');

const rootPath = path.resolve(__dirname, '../');

// 拷贝模块到 ice-rn-start 的 node_modules 目录（rn 不支持快捷方式，所以使用拷贝的方式）
function copyModules() {
    let modules = getModules(rootPath + '/packages/ice-rn-start/package.json');

    modules.forEach((module) => {
        let source = rootPath + `/packages/${module}`;
        let dist = rootPath + `/packages/ice-rn-start/node_modules/${module}`;

        if(!fs.existsSync(source)){
            return;
        }
        
        if(fs.existsSync(dist)){
            try{
                // 有可能dist是一个快捷方式，可以直接删除
                fs.rmdirSync(dist);
            }
            catch{
                // 否则递归删除
                rmdir(dist)
            }
        }

        copyDir(source, dist, ['node_modules']);
    });
}

copyModules();
buildRNModule();
watchRNModules((module) => {
    return rootPath + `/packages/ice-rn-start/node_modules/${module}/dist`
});

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