const path = require('path');
const rootPath = path.resolve(__dirname, '../');

// 获取包路径
const getPackagePath = function(packageName) {
    return `${rootPath}/packages/${packageName}`;
}

// 获取 package.json 文件路径
const getPackageFilePath = function(packageName) {
    return `${rootPath}/packages/${packageName}/package.json`;
}

const paths = {
    rootPath: rootPath,
    // web 端 start 包的路径
    webStart: getPackagePath('ice-react-start'),
    webStartPackageFile: getPackageFilePath('ice-react-start'),
    // native 端 start 包的路径
    nativeStart:getPackagePath('ice-rn-start'),
    nativeStartPackageFile: getPackageFilePath('ice-rn-start'),
}

module.exports = {
    paths,
    getPackagePath,
    getPackageFilePath
};