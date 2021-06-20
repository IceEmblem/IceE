// 当前执行的根路径
const rootPath = __dirname.replace(/icee_config$/, '');

// 获取模块列表
function getModules(packagePath) {
    let dependenciesObj = require(packagePath).dependencies;

    let dependencies = Object.keys(dependenciesObj);

    let iceModules = [];
    dependencies.forEach(item => {
        if (item.startsWith('ice-')) {
            iceModules.push(item);
        }
    });

    return iceModules;
}
module.exports.getModules = getModules;

// 生成模块列表文件
function buildModuleFile(modules, moduleOutputPath) {
    var fs = require("fs");

    let importListStr = "// -----该文件由 Webpack 编译时动态生成，请勿直接更改-----\n\n";
    let moduleListStr = "";

    modules.forEach((module) => {
        let moduleName = module.replace(/-/g, '');
        importListStr = importListStr + `import { Module as ${moduleName} } from "${module}";\n`;
        moduleListStr = moduleListStr + moduleName + ",";
    });

    importListStr = `${importListStr}\n`;
    moduleListStr = `const moduleList = [${moduleListStr}];\n`;
    moduleListStr = moduleListStr + `export default moduleList;\n`;

    fs.writeFileSync(moduleOutputPath, importListStr + moduleListStr);
}
module.exports.buildModuleFile = buildModuleFile;

// 生成模块列表
function buildModuleFileOfStartPackage(startPackageName) {
    buildModuleFile(
        getModules(rootPath + `packages/${startPackageName}/package.json`),
        rootPath + `packages/${startPackageName}/src/ModuleList.js`
    );
}
module.exports.buildModuleFileOfStartPackage = buildModuleFileOfStartPackage;

// 监听模块
function watchModule(module, getOutDir, isWatch = true) {
    const { exec } = require('child_process');
    const fs = require('fs')

    const source = `${rootPath}packages/${module}/src`;
    if (!fs.existsSync(source)) {
        return;
    }
    let outDir = null;
    if (getOutDir) {
        outDir = getOutDir(module);
    }
    else {
        outDir = `${rootPath}packages/${module}/dist`;
    }

    const cmd = `${rootPath}node_modules/.bin/babel ${source} ${isWatch ? '-w' : ''} --out-dir ${outDir} --copy-files --delete-dir-on-start --extensions .js,.jsx,.ts,.tsx`;
    console.log(`模块 ${module} :`, cmd);

    const babel = exec(cmd, {
        cwd: rootPath,
    });

    babel.stdout.on('data', (data) => {
        console.log(`模块 ${module} `, data);
    });

    babel.stderr.on('data', (data) => {
        console.error(`模块 ${module} `, data);
    });

    babel.on('close', (code) => {
        console.log(`模块 ${module} 已退出，退出码：${code}`);
    });
}
module.exports.watchModule = watchModule;

// 监听模块
function watchModules(startPackageName, getOutDir = null) {
    let modules = getModules(rootPath + `packages/${startPackageName}/package.json`);
    modules.forEach(module => {
        watchModule(module, getOutDir);
    })
}
module.exports.watchModules = watchModules;

// babel 打包模块
function babelBuildModules(startPackageName) {
    let modules = getModules(rootPath + `packages/${startPackageName}/package.json`);
    modules.forEach(module => {
        watchModule(module, null, false);
    })
}
module.exports.babelBuildModules = babelBuildModules;

// platform: 'web' | 'native'
const packageTemplet = {
    "name": "",
    "version": "0.1.0",
    "main": "dist/index.js",
    "license": "MIT"
};
const moduleTemplet = `
import {BaseModule, ModuleFactory} from 'icetf'
import {Module as CoreModule} from 'ice-core';

export default class Module extends BaseModule {
    initialize() {
    }
}

new ModuleFactory().register(Module, [CoreModule]);
`;
const indexTemplet = `
export { default as Module } from './Module';
`;
function createModule(moduleName, startPackageName) {
    const fs = require("fs");

    // 包名前缀
    let fullModuleName = null;
    // 如果是 RN 包
    if (startPackageName == 'ice-rn-start') {
        fullModuleName = `ice-rn-${moduleName}`;
    }
    else{
        fullModuleName = `ice-react-${moduleName}`;
    }


    let packageDirPath = `${rootPath}packages/${fullModuleName}`;

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

    let startPackage = require(`${rootPath}packages/${startPackageName}/package.json`);

    // 写入package.json文件
    let package = { ...packageTemplet };
    package.name = fullModuleName;
    package.version = startPackage.version;
    package.dependencies = {
        "icetf": `^${startPackage.version}`,
        "ice-core": `^${startPackage.version}`
    }

    // 如果是 RN 包
    if (startPackageName == 'ice-rn-start') {
        package.installConfig = {
            "hoistingLimits": "workspaces"
        }
    }

    // 写入 package.json 文件
    fs.writeFileSync(packageDirPath + '/package.json', JSON.stringify(package, null, "\t"));

    // 更新start模块的package.json
    startPackage.dependencies[fullModuleName] = `^${startPackage.version}`;
    fs.writeFileSync(`${rootPath}packages/${startPackageName}/package.json`, JSON.stringify(startPackage, null, "\t"));
}
module.exports.createModule = createModule;

// 拷贝模块到 ice-rn-start 的 node_modules 目录（快捷键映射总会存在一些问题，这里直接拷贝）
function copyModules(startPackageName) {
    const {copyDir, rmdir} = require('./utiliy');

    let modules = getModules(rootPath + `/packages/${startPackageName}/package.json`);

    modules.forEach((module) => {
        let source = rootPath + `/packages/${module}`;
        let dist = rootPath + `/packages/${startPackageName}/node_modules/${module}`;

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
    });
}
module.exports.copyModules = copyModules;