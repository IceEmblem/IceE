const {createModule, babelBuildModules} = require('./icee_config/module')

// 创建模块
function createM(cmd, name){
    if(cmd == 'cw'){
        createModule(name, 'ice-react-start');
    }
    else{
        createModule(name, 'ice-rn-start');
    }
}

// 打包所有模块
function babelBuildM(cmd){
    if(cmd == 'bw'){
        babelBuildModules('ice-react-start');
    }
    else{
        babelBuildModules('ice-rn-start');
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

# babel 编译所有 web package
node icee bw

# babel 编译所有 rn package
node icee bn

`
    );
    return;
}

if(process.argv[2] == 'cw' || process.argv[2] == 'cn'){
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

console.log('无效的命令');