// 当前执行的根路径
const rootPath = __dirname.replace(/icee_config$/, '');

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

// 监听模块
function watchModule(module, getOutDir) {
    const { exec } = require('child_process');
    const fs = require('fs')

    const source = `${rootPath}packages/${module}/src`;
    if(!fs.existsSync(source)){
        return;
    }
    let outDir = null;
    if(getOutDir){
        outDir = getOutDir(module);
    }
    else{
        outDir = `${rootPath}packages/${module}/dist`;
    }

    const cmd = `${rootPath}node_modules/.bin/babel ${source} -w --out-dir ${outDir} --copy-files --delete-dir-on-start --extensions .js,.jsx,.ts,.tsx`;
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
function watchModules(startPackageName, getOutDir = null){
    let modules = getModules(rootPath + `packages/${startPackageName}/package.json`);
    modules.forEach(module => {
        watchModule(module, getOutDir);
    })
}
module.exports.watchModules = watchModules;

// 生成模块列表
function buildModule(startPackageName) {
    buildModuleFile(
        getModules(rootPath + `packages/${startPackageName}/package.json`),
        rootPath + `packages/${startPackageName}/src/ModuleList.js`
    );
}
module.exports.buildModule = buildModule;