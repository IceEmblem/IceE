const {babelBuildModules, copyModules, buildModuleListFile} = require('./icee_config/module');
const {createModule} = require('./icee_config/createModule');

// 创建模块
function createM(cmd, name){
    if(cmd == 'cw'){
        createModule(name, 'web');
        buildModuleListFile('web');
    }
    else if(cmd == 'cn'){
        createModule(name, 'native');
        buildModuleListFile('native');
    }
    else{
        createModule(name, 'common');
        buildModuleListFile('web');
        buildModuleListFile('native');
    }
}

// 打包所有模块
function babelBuildM(cmd){
    if(cmd == 'bw'){
        babelBuildModules('web');
        buildModuleListFile('web');
    }
    else{
        babelBuildModules('native');
        copyModules('native');
        buildModuleListFile('native');
    }
}

// 生成 ModuleList 文件
function buildModuleList(cmd){
    if(cmd == 'mlw'){
        buildModuleListFile('web');
    }
    else{
        buildModuleListFile('native');
    }
}

// 命令提示
if(process.argv.length <= 2){
    console.log(
`
# 创建 web 包
node icee cw xxx

# 创建 rn 包
node icee cn xxx

# 创建通用包
node icee cc xxx

# babel 编译所有 web package
node icee bw

# babel 编译所有 rn package
node icee bn

# 从 web package.json 安装的包导入模块
node icee mlw

# 从 rn package.json 安装的包导入模块
node icee mln
`
    );
    return;
}

if(process.argv[2] == 'cw' || process.argv[2] == 'cn' || process.argv[2] == 'cc'){
    if(process.argv <= 3){
        console.log('请输入包名');
        return;
    }
    createM(process.argv[2], process.argv[3]);
    return;
}

if(process.argv[2] == 'bw' || process.argv[2] == 'bn'){
    babelBuildM(process.argv[2]);
    return;
}

if(process.argv[2] == 'mlw' || process.argv[2] == 'mln'){
    buildModuleList(process.argv[2]);
    return;
}

console.log('无效的命令');