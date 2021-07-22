const { paths, getPackagePath, getPackageFilePath } = require('./paths');
const fs = require('fs')

// 获取模块列表
function getModules(packageFilePath) {
    let dependenciesObj = require(packageFilePath).dependencies;

    let dependencies = Object.keys(dependenciesObj);

    let iceModules = [];
    dependencies.forEach(item => {
        if (item.startsWith('ice-')) {
            iceModules.push(item);
        }
    });

    return iceModules;
}

// 生成模块列表文件
function buildModuleListFile(platform) {
    let modules = getModules(platform == 'web' ?
        paths.webStartPackageFile :
        paths.nativeStartPackageFile
    );

    let moduleOutputPath = platform == 'web' ?
        `${paths.webStart}/src/ModuleList.js` :
        `${paths.nativeStart}/src/ModuleList.js`;

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
module.exports.buildModuleListFile = buildModuleListFile;

// 监听模块
function watchModule(module, getOutDir, isWatch = true) {
    const { exec } = require('child_process');

    const source = `${getPackagePath(module)}/src`;
    if (!fs.existsSync(source)) {
        return;
    }
    let outDir = null;
    if (getOutDir) {
        outDir = getOutDir(module);
    }
    else {
        outDir = `${getPackagePath(module)}/dist`;
    }

    const cmd = `${paths.rootPath}/node_modules/.bin/babel ${source} ${isWatch ? '-w' : ''} --out-dir ${outDir} --copy-files --delete-dir-on-start --extensions .js,.jsx,.ts,.tsx`;
    console.log(`模块 ${module} :`, cmd);

    const babel = exec(cmd, {
        cwd: paths.rootPath,
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
function watchModules(platform, getOutDir = null) {
    let modules = getModules(platform == 'web' ?
        paths.webStartPackageFile :
        paths.nativeStartPackageFile
    );
    modules.forEach(module => {
        watchModule(module, getOutDir);
    })
}
module.exports.watchModules = watchModules;

// babel 打包模块
function babelBuildModules(platform) {
    let modules = getModules(platform == 'web' ?
        paths.webStartPackageFile :
        paths.nativeStartPackageFile
    );
    modules.forEach(module => {
        watchModule(module, null, false);
    })
}
module.exports.babelBuildModules = babelBuildModules;

// 拷贝模块到 ice-rn-start 的 node_modules 目录（快捷键映射总会存在一些问题，这里直接拷贝）
function copyModules(platform) {
    const {copyDir, rmdir} = require('./utiliy');

    let modules = getModules(platform == 'web' ?
        paths.webStartPackageFile :
        paths.nativeStartPackageFile
    );

    modules.forEach((module) => {
        let source = getPackagePath(module);
        let startPackagePath = platform == 'web' ?
            paths.webStart :
            paths.nativeStart;
    
        let dist = startPackagePath + `/node_modules/${module}`;

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