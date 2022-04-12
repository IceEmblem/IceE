const { watchModules, copyModules, compileModules, checkModuleExit } = require('./module');
const { getPackagePath } = require('./paths');
const { execCmd } = require('./utiliy');
const {createModule} = require('./createModule');
const fs = require("fs");

// 调试
function start(startModule, startCmd) {
    if(!checkModuleExit(startModule)){
        console.log(`${startModule}不存在，请检查模块名是否正确`);
        return;
    }

    let package = require(`${getPackagePath(startModule)}/package.json`);
    if(!package.iceeConfig){
        console.error(`请为项目${startModule}配置iceeConfig字段`);
        return;
    }

    let hoistDependencies = require(`${getPackagePath(startModule)}/package.json`).iceeConfig.hoistDependencies;

    if (hoistDependencies) {
        copyModules(startModule);
        watchModules(startModule, (module) => {
            return `${getPackagePath(startModule)}/node_modules/${module}/dist`
        });
    }
    else {
        watchModules(startModule)
    }

    execCmd(`cd ${getPackagePath(startModule)} && ${startCmd}`);
}
module.exports.start = start;

// 创建模块
module.exports.createModule = createModule;

// 编译入口模块
function compileStartModule(startModule) {
    if(!checkModuleExit(startModule)){
        console.log(`${startModule}不存在，请检查模块名是否正确`);
        return;
    }

    let package = require(`${getPackagePath(startModule)}/package.json`);
    if(!package.iceeConfig){
        console.error(`请为项目${startModule}配置iceeConfig字段`);
        return;
    }

    let hoistDependencies = require(`${getPackagePath(startModule)}/package.json`).iceeConfig.hoistDependencies;

    if(hoistDependencies){
        compileModules(startModule, () => {
            copyModules(startModule);
        });
    }
    else{
        compileModules(startModule);
    }
}
module.exports.compileStartModule = compileStartModule;