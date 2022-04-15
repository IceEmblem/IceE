const { paths, getPackagePath } = require('./paths');
const { execCmd } = require('./utiliy');
const fs = require('fs');

// 获取packages目录下的所有包
const packages = (function() {
    let arrs = [];
    let src = paths.rootPath + '/packages';

    // 读取目录中的所有文件/目录
    fs.readdirSync(src).forEach(function (path) {
        const _src = src + '/' + path;

        let st = fs.statSync(_src);

        // 判断是否为文件
        if (st.isDirectory()) {
            arrs.push(path);
        }
    });
    
    return arrs;
})()

// 检查模式是否存在
function checkModuleExit(module) {
    let path = `${getPackagePath(module)}/package.json`;

    if (fs.existsSync(path)) {
        return true;
    }

    return false;
}
module.exports.checkModuleExit = checkModuleExit;

// 获取需要编译的模块
function getNeedCompileModules(module) {
    let arr = [];
    let dependencies = Object.keys(require(`${getPackagePath(module)}/package.json`).dependencies);
    let needCompiles = packages.filter(e => dependencies.some(ie => e == ie));
    needCompiles.forEach(needCompile => {
        if(arr.some(e => e == needCompile)){
            return;
        }
        arr.push(needCompile);
        getNeedCompileModules(needCompile).forEach(child => {
            if(arr.some(e => e == child)){
                return;
            }
            arr.push(child);
        })
    });

    return arr;
}

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

    execCmd(cmd, {
        cwd: paths.rootPath,
    }, onexit);
}
module.exports.compileModule = compileModule;

// 监听入口模块所依赖的的模块列表
function watchModules(startModule, customizeOutDir = null) {
    let modules = getNeedCompileModules(startModule);
    modules.forEach(module => {
        compileModule(module, customizeOutDir, true);
    });
}
module.exports.watchModules = watchModules;

// 打包入口模块所依赖的的模块列表
function compileModules(startModule, onexitCallback) {
    let modules = getNeedCompileModules(startModule);
    let runingNum = modules.length;
    let onexit = () => {
        runingNum--;
        if(runingNum <= 0 && onexitCallback) {
            onexitCallback();
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

    let modules = getNeedCompileModules(startModule);

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
