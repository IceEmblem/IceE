const { paths, getPackagePath } = require('./paths');
const fs = require('fs');

// 获取模块列表
function getModules(module) {
    return require(`${getPackagePath(module)}/package.json`).iceeConfig.dependencies;
}

// 生成模块列表文件
function buildModuleListFile(startModule) {
    let modules = getModules(startModule);

    let moduleOutputPath = `${getPackagePath(startModule)}/src/ModuleList.js`;

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
function compileModule(module, customizeOutDir, iswatch, onexit) {
    const { exec } = require('child_process');

    const source = `${getPackagePath(module)}/src`;
    if (!fs.existsSync(source)) {
        return;
    }

    let outDir;
    if (customizeOutDir) {
        outDir = customizeOutDir(module);
    }
    else {
        outDir = `${getPackagePath(module)}/dist`;
    }

    const cmd = `${paths.rootPath}/node_modules/.bin/babel ${source} ${iswatch ? '-w -s' : ''} --out-dir ${outDir} --copy-files --delete-dir-on-start --extensions .js,.jsx,.ts,.tsx`;
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
        if (onexit) {
            onexit();
        }
    });
}
module.exports.compileModule = compileModule;

// 监听入口模块所依赖的的模块列表
function watchModules(startModule, customizeOutDir = null) {
    let modules = getModules(startModule);
    modules.forEach(module => {
        compileModule(module, customizeOutDir, true);
    });
}
module.exports.watchModules = watchModules;

// 打包入口模块所依赖的的模块列表
function compileModules(startModule, onexit) {
    let modules = getModules(startModule);
    let runingNum = modules.length;
    let onexit = () => {
        runingNum--;
        if(runingNum <= 0 && onexit) {
            onexit();
        }
    }
    modules.forEach(module => {
        compileModule(module, null, false, onexit);
    })
}
module.exports.compileModules = compileModules;

// 拷贝模块到 ice-rn-start 的 node_modules 目录（快捷键映射总会存在一些问题，这里直接拷贝）
function copyModules(startModule) {
    const { copyDir, rmdir } = require('./utiliy');

    let modules = getModules(startModule);

    modules.forEach((module) => {
        let source = getPackagePath(module);

        let dist = getPackagePath(startModule) + `/node_modules/${module}`;

        if (!fs.existsSync(source)) {
            return;
        }

        if (fs.existsSync(dist)) {
            try {
                // 有可能dist是一个快捷方式，可以直接删除
                fs.rmdirSync(dist);
            }
            catch {
                // 否则递归删除
                rmdir(dist)
            }
        }

        copyDir(source, dist, ['node_modules']);
    });
}
module.exports.copyModules = copyModules;