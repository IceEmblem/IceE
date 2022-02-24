const path = require('path');
const rootPath = path.resolve(__dirname, '../');

// 获取包路径
const getPackagePath = function(packageName) {
    return `${rootPath}/packages/${packageName}`;
}

const paths = {
    rootPath: rootPath,
}

module.exports = {
    paths,
    coreName: `ice-core`,
    getPackagePath,
};