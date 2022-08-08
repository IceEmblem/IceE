const { start, createModule, compileStartModule } = require('./icee_config/start');

(function () {
    // 命令提示
    if (process.argv.length <= 2) {
        console.log(
            `
欢迎使用IceE，版本 0.8.0

# 调试
node icee -s "入口模块运行命令" "入口模块名"

# 创建包
node icee -c "模块名"

# babel 编译项目所依赖的包
node icee -b "入口模块名"
`
        );
        return;
    }

    if (process.argv[2] == '-s') {
        if (process.argv <= 4) {
            console.error('无效的参数');
            return;
        }

        start(process.argv[4], process.argv[3])
        return;
    }

    if (process.argv[2] == '-c') {
        if (process.argv <= 3) {
            console.error('请输入包名');
            return;
        }
        createModule(process.argv[3]);
        return;
    }

    if (process.argv[2] == '-b') {
        if (process.argv <= 3) {
            console.error('请输入包名');
            return;
        }
        compileStartModule(process.argv[3]);
        return;
    }

    console.log('无效的命令');
})();