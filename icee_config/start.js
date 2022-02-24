const { watchModules, copyModules } = require('./module');
const { getPackagePath } = require('./paths');
const { execCmd } = require('./utiliy');

// platform: 'web' | 'native'
function start(startModule) {
    let hoistDependencies = require(getPackagePath(startModule)).iceeConfig.hoistDependencies;

    if (hoistDependencies) {
        copyModules(startModule);
        watchModules(startModule, (module) => {
            return `${getPackagePath(startModule)}/node_modules/${module}/dist`
        });
    }
    else {
        watchModules(startModule)
    }
}

console.log(process.argv);

// 编译依赖项
let startCmdIndex = process.argv.findIndex(e => e == '-c');
if(startCmdIndex < 0){
    console.log('错误：请输入入口项目运行命令');
    return;
}
let startModule = process.argv[process.argv.length - 1];
start(startModule);

// 运行入口程序
let startCmd = process.argv[startCmdIndex + 1];
execCmd(startCmd);