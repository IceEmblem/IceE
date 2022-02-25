const {start, createModule, compileStartModule, buildModuleListFile} = require('./icee_config/start');

// 命令提示
if(process.argv.length <= 2){
    console.log(
`
# 调试
node icee -s "项目运行命令" "项目名"

# 创建包
node icee -c "项目名"

# babel 编译项目所依赖的包
node icee -b "项目名"

# 生成 ModuleList.js 文件
node icee -ml "项目名"
`
    );
    return;
}

if(process.argv[2] == '-s'){
    if(process.argv <= 5){
        console.error('无效的参数');
        return;
    }
    
    // 项目名
    let startCmdIndex = process.argv.findIndex(e => e == '-c');
    if(startCmdIndex < 0){
        console.error('请输入入口项目运行命令');
        return;
    }
    let startModule = process.argv[process.argv.length - 1];

    // 项目运行命令
    let startCmd = process.argv[startCmdIndex + 1];
    
    start(startModule, startCmd)

    return;
}

if(process.argv[2] == '-c'){
    if(process.argv <= 3){
        console.error('请输入包名');
        return;
    }
    createModule(process.argv[3]);
    return;
}

if(process.argv[2] == '-b'){
    if(process.argv <= 3){
        console.error('请输入包名');
        return;
    }
    compileStartModule(process.argv[3]);
    return;
}

if(process.argv[2] == '-ml'){
    if(process.argv <= 3){
        console.error('请输入包名');
        return;
    }
    buildModuleListFile(process.argv[3]);
    return;
}

console.log('无效的命令');