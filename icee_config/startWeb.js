const { buildWebModule, watchWebModules, getModules } = require('./module');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs')
const {copyDir, rmdir} = require('./utiliy');

const rootPath = path.resolve(__dirname, '../');

// 拷贝模块到 ice-react-start 的 node_modules 目录（已快捷键映射总会存在一些问题，这里直接拷贝）
function copyModules() {
    let modules = getModules(rootPath + '/packages/ice-react-start/package.json');

    modules.forEach((module) => {
        let source = rootPath + `/packages/${module}`;
        let dist = rootPath + `/packages/ice-react-start/node_modules/${module}`;

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
buildWebModule();
watchWebModules();

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