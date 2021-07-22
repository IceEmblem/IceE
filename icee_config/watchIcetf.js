const { watchModule } = require('./module');
const paths = require('./paths');
const fs = require('fs');
const {copyDir, rmdir} = require('./utiliy');

// platform: 'web' | 'native'
function watchIcetf(platform){
    if(platform == 'web'){
        watchModule('icetf');
        return;
    }
    
    // rn 处理流程
    let source = paths.getPackagePath('icetf');
    let dist = `${paths.paths.nativeStart}/node_modules/icetf`;

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

    watchModule('icetf', (module) => {
        return paths.paths.nativeStart + `/node_modules/${module}/dist`
    });
}
module.exports.watchIcetf = watchIcetf;