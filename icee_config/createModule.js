const { paths, getPackagePath, getComPackageName, getWebPackageName, getRNPackageName } = require('./paths');
const { buildModuleListFile } = require('./module');
const fs = require("fs");

// platform: 'web' | 'native' | 'common'
const packageTemplet = {
    "name": "",
    "version": "0.1.0",
    "main": "dist/index.js",
    "license": "MIT"
};
const moduleTemplet = `
import {BaseModule, ModuleFactory} from 'icetf';
import {Module as CoreModule} from '${getComPackageName('core')}';

export default class Module extends BaseModule {
    initialize() {
    }
}

ModuleFactory.register(Module, [CoreModule]);
`;
const indexTemplet = `
export { default as Module } from './Module';
`;

// 生成模块
function buildModule(fullModuleName, version, platform) {

    let packageDirPath = getPackagePath(fullModuleName);

    if (fs.existsSync(packageDirPath)) {
        throw new Error('创建失败，包已存在');
    }

    // 创建目录
    fs.mkdirSync(packageDirPath);
    fs.mkdirSync(`${packageDirPath}/src`);

    // 写入module文件
    fs.writeFileSync(`${packageDirPath}/src/Module.js`, moduleTemplet);
    // 写入index文件
    fs.writeFileSync(`${packageDirPath}/src/index.js`, indexTemplet);

    // 写入package.json文件
    let package = { ...packageTemplet };
    package.name = fullModuleName;
    package.version = version;
    package.dependencies = {
        "icetf": `^${version}`,
    }
    package.dependencies[getComPackageName('core')] = `^${version}`;

    // 如果是 RN 包
    if (platform == 'native') {
        package.installConfig = {
            "hoistingLimits": "workspaces"
        }
    }

    // 写入 package.json 文件
    fs.writeFileSync(packageDirPath + '/package.json', JSON.stringify(package, null, "\t"));
}

// 更新 start 模块的 package.json
function updateStartPackage(fullModuleName, version, startPackageFilePath) {

    let startPackage = require(startPackageFilePath);
    startPackage.dependencies[fullModuleName] = `^${version}`;

    fs.writeFileSync(startPackageFilePath, JSON.stringify(startPackage, null, "\t"));
}

// 创建模块
function createModule(moduleName, platform) 
{
    // 包名前缀
    let fullModuleName = null;
    let version = '0.1.0';

    // 如果是 RN 包
    if (platform == 'native') {
        fullModuleName = getRNPackageName(moduleName);
        version = require(paths.nativeStartPackageFile).version;

        updateStartPackage(fullModuleName, version, paths.nativeStartPackageFile);
        buildModuleListFile(platform);
    }
    // 如果是 Web 包
    else if(platform == 'web') {
        fullModuleName = getWebPackageName(moduleName);
        version = require(paths.webStartPackageFile).version;

        updateStartPackage(fullModuleName, version, paths.webStartPackageFile);
        buildModuleListFile(platform);
    }
    // 否则是通用包
    else {
        fullModuleName = getComPackageName(moduleName);

        updateStartPackage(fullModuleName, version, paths.nativeStartPackageFile);
        buildModuleListFile('native');
        updateStartPackage(fullModuleName, version, paths.webStartPackageFile);
        buildModuleListFile('web');
    }

    buildModule(fullModuleName, version, platform);
}
module.exports.createModule = createModule;