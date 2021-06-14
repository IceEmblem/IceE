const { watchModule } = require('./module');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs')
const {copyDir, rmdir} = require('./utiliy');

const rootPath = path.resolve(__dirname, '../');

// platform: 'web' | 'native'
function watchIcetf(platform){
    let startPackageName = null;

    if(platform == 'web'){
        startPackageName = 'ice-react-start';
    }
    else{
        startPackageName = 'ice-rn-start';
    }

    let source = rootPath + `/packages/icetf`;
    let dist = rootPath + `/packages/${startPackageName}/node_modules/icetf`;

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
        return rootPath + `/packages/${startPackageName}/node_modules/${module}/dist`
    })
}
module.exports.watchIcetf = watchIcetf;