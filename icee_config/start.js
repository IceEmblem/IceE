const { buildModuleFileOfStartPackage, watchModules, getModules } = require('./module');
const path = require('path');
const fs = require('fs')
const {copyDir, rmdir} = require('./utiliy');

const rootPath = path.resolve(__dirname, '../');

// 拷贝模块到 ice-rn-start 或 ice-react-start 的 node_modules 目录（快捷键映射总会存在一些问题，这里直接拷贝）
function copyModules(startPackageName) {
    let modules = getModules(rootPath + `/packages/${startPackageName}/package.json`);

    modules.forEach((module) => {
        let source = rootPath + `/packages/${module}`;
        let dist = rootPath + `/packages/${startPackageName}/node_modules/${module}`;

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

// platform: 'web' | 'native'
function start(platform){
    let startPackageName = null;
    if(platform == 'web'){
        startPackageName = 'ice-react-start';
    }
    else{
        startPackageName = 'ice-rn-start';
    }

    buildModuleFileOfStartPackage(startPackageName);

    if(platform == 'web'){
        watchModules(startPackageName)
    }
    else{
        copyModules(startPackageName);
        watchModules(startPackageName, (module) => {
            return rootPath + `/packages/${startPackageName}/node_modules/${module}/dist`
        });
    }
}
module.exports.start = start;
