const { compileModule } = require('./module');
const {getPackagePath} = require('./paths');
const fs = require('fs');
const {copyDir, rmdir} = require('./utiliy');

// platform: 'web' | 'native'
function watchIcetf(startModule){
    let package = require(`${getPackagePath(startModule)}/package.json`);
    if(!package.iceeConfig){
        console.error(`请为项目${startModule}配置iceeConfig字段`);
        return;
    }

    let hoistDependencies = require(`${getPackagePath(startModule)}/package.json`).iceeConfig.hoistDependencies;

    if(!hoistDependencies){
        compileModule('icetf', null, true);
        return;
    }
    
    // rn 处理流程
    let source = getPackagePath('icetf');
    let dist = `${getPackagePath(startModule)}/node_modules/icetf`;

    if(!fs.existsSync(source)){
        console.log("icetf不存在");
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

    compileModule('icetf', (module) => {
        return `${getPackagePath(startModule)}/node_modules/${module}/dist`
    }, true);
}
module.exports.watchIcetf = watchIcetf;