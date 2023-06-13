const { getPackagePath, coreName } = require('./paths');
const fs = require("fs");

// platform: 'web' | 'native' | 'common'
const packageTemplet = {
    "name": "",
    "version": "0.1.0",
    "main": "dist/index.js",
    "types": "src/index.ts",
    "license": "MIT"
};
const moduleTemplet = 
`import {BaseModule, ModuleFactory} from 'icetf';
import {Module as CoreModule} from '${coreName}';

class Module extends BaseModule {
    initialize() {
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [CoreModule]);
`;
const indexTemplet = 
`export { default as Module } from './Module';
`;

// 创建模块
function createModule(fullModuleName) 
{
    let corePackageVersion = require(`${getPackagePath(coreName)}/package.json`).version;

    let packageDirPath = getPackagePath(fullModuleName);

    if (fs.existsSync(packageDirPath)) {
        throw new Error('创建失败，包已存在');
    }

    // 创建目录
    fs.mkdirSync(packageDirPath);
    fs.mkdirSync(`${packageDirPath}/src`);

    // 写入module文件
    fs.writeFileSync(`${packageDirPath}/src/Module.ts`, moduleTemplet);
    // 写入index文件
    fs.writeFileSync(`${packageDirPath}/src/index.ts`, indexTemplet);

    // 写入package.json文件
    let package = { ...packageTemplet };
    package.name = fullModuleName;
    package.version = corePackageVersion;
    package.dependencies = {
        // "icetf": `^${version}`,
    }
    package.dependencies[coreName] = `workspace:^`;

    // 写入 package.json 文件
    fs.writeFileSync(packageDirPath + '/package.json', JSON.stringify(package, null, "\t"));
}
module.exports.createModule = createModule;