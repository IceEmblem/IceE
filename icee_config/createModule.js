const { getPackagePath, coreName } = require('./paths');
const fs = require("fs");

// platform: 'web' | 'native' | 'common'
const packageTemplet = {
    "name": "",
    "version": "0.1.0",
    "main": "dist/index.js",
    "types": "types/index.d.ts",
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
const indexDTSTemplet = 
`import React from 'react';
import { BaseModule } from 'icetf';

export declare class Module extends BaseModule {
}
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
    fs.mkdirSync(`${packageDirPath}/types`);

    // 写入module文件
    fs.writeFileSync(`${packageDirPath}/src/Module.js`, moduleTemplet);
    // 写入index文件
    fs.writeFileSync(`${packageDirPath}/src/index.js`, indexTemplet);
    // 写入index.d.ts文件
    fs.writeFileSync(`${packageDirPath}/types/index.d.ts`, indexDTSTemplet);

    // 写入package.json文件
    let package = { ...packageTemplet };
    package.name = fullModuleName;
    package.version = corePackageVersion;
    package.dependencies = {
        // "icetf": `^${version}`,
    }
    package.dependencies[coreName] = `^${corePackageVersion}`;

    // 写入 package.json 文件
    fs.writeFileSync(packageDirPath + '/package.json', JSON.stringify(package, null, "\t"));
}
module.exports.createModule = createModule;