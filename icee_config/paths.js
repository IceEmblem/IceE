const path = require('path');
const rootPath = path.resolve(__dirname, '../');

// 包前缀
const packagePre = 'ice';

// 获取包路径
const getPackagePath = function(packageName) {
    return `${rootPath}/packages/${packageName}`;
}

// 获取 package.json 文件路径
const getPackageFilePath = function(packageName) {
    return `${rootPath}/packages/${packageName}/package.json`;
}

// 获取web端包名
const getWebPackageName = function(moduleName) {
    return `${packagePre}-react-${moduleName}`;
}

// 获取rn端包名
const getRNPackageName = function(moduleName) {
    return `${packagePre}-rn-${moduleName}`;
}

// 获取通用包名
const getComPackageName = function(moduleName) {
    return `${packagePre}-${moduleName}`
}

const paths = {
    packagePre: `${packagePre}-`,
    rootPath: rootPath,
    // web 端 start 包的路径
    webStart: getPackagePath(getWebPackageName('start')),
    webStartPackageFile: getPackageFilePath(getWebPackageName('start')),
    // native 端 start 包的路径
    nativeStart:getPackagePath(getRNPackageName('start')),
    nativeStartPackageFile: getPackageFilePath(getRNPackageName('start')),
}

module.exports = {
    paths,
    getPackagePath,
    getPackageFilePath,
    getWebPackageName,
    getRNPackageName,
    getComPackageName
};