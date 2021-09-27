const { watchModules, copyModules } = require('./module');
const { paths, getPackagePath, getPackageFilePath } = require('./paths');
const path = require('path');

const rootPath = path.resolve(__dirname, '../');

// platform: 'web' | 'native'
function start(platform){
    if(platform == 'web'){
        watchModules(platform)
    }
    else{
        copyModules(platform);
        watchModules(platform, (module) => {
            return paths.nativeStart + `/node_modules/${module}/dist`
        });
    }
}
module.exports.start = start;
