const path = require('path');
const fs = require('fs')

// 拷贝目录
function copyDir(src, dst, ignores = []) {
    if(!fs.existsSync(dst)){
        fs.mkdirSync(dst);
    }

    // 读取目录中的所有文件/目录
    let paths = fs.readdirSync(src);

    paths.forEach(function (path) {
        // 忽略的名称
        if(ignores.some(e => e == path)){
            return;
        }

        const _src = src + '/' + path;
        const _dst = dst + '/' + path;

        let readable; 
        let writable;
        
        let st = fs.statSync(_src);

        // 判断是否为文件
        if (st.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(_src)
            // 创建写入流
            writable = fs.createWriteStream(_dst)
            // 通过管道来传输流
            readable.pipe(writable)
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
            copyDir(_src, _dst, ignores)
        }
    })
}
module.exports.copyDir = copyDir;

// 递归删除目录
function rmdir(filePath) {
    let stat = fs.statSync(filePath)
    if(stat.isFile()) {
        fs.unlinkSync(filePath)
    }
    else {
        let dirs = fs.readdirSync(filePath)
        dirs = dirs.map(dir => rmdir(path.join(filePath, dir)))
        fs.rmdirSync(filePath)
    }
}
module.exports.rmdir = rmdir;