const { buildModuleFileOfStartPackage, watchModules, copyModules } = require('./module');
const path = require('path');

const rootPath = path.resolve(__dirname, '../');

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
