// 当前执行的根路径
const rootPath = __dirname.replace(/icee_config$/, '');
const webPackagePath = rootPath + 'packages/ice-react-start/package.json';
const rnPackagePath = rootPath + 'packages/ice-rn-start/package.json';

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

    let outDir = null;
    if(getOutDir){
        outDir = getOutDir(module);
    }
    else{
        outDir = `${rootPath}packages/${module}/dist`;
    }

    const cmd = `${rootPath}node_modules/.bin/babel ${rootPath}packages/${module}/src -w --out-dir ${outDir} --copy-files --delete-dir-on-start --extensions .js,.jsx,.ts,.tsx`;
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

// 监听Web模块
function watchWebModules(getOutDir = null) {
    let modules = getModules(webPackagePath);
    modules.forEach(module => {
        watchModule(module, getOutDir);
    })
}
module.exports.watchWebModules = watchWebModules;

// 监听RN模块
function watchRNModules(getOutDir = null) {
    let modules = getModules(rnPackagePath);
    modules.forEach(module => {
        watchModule(module, getOutDir);
    })
}
module.exports.watchRNModules = watchRNModules;

// 生成Web模块列表
function buildWebModule() {
    buildModuleFile(
        getModules(webPackagePath),
        rootPath + 'packages/ice-react-start/src/ModuleList.js'
    );
}
module.exports.buildWebModule = buildWebModule;

// 生成RN模块列表
function buildRNModule() {
    buildModuleFile(
        getModules(rnPackagePath),
        rootPath + 'packages/ice-rn-start/src/ModuleList.js'
    );
}
module.exports.buildRNModule = buildRNModule;