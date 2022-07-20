export default class Tool {
    // 图片转base64编码
    // file: event.target.files[0];
    // setBase64StringFun: fun(base64)
    static imageToBase64String(file: any, setBase64StringFun: (base64: string) => void) {
        //判断是否是图片类型
        if (!/image\/\w+/.test(file.type)) {
            alert("只能选择图片");
            return false;
        }

        Tool.fileToBase64String(file, setBase64StringFun)
    }

    // 文件转base64编码
    static fileToBase64String(file: any, setBase64StringFun: (base64: string) => void) {
        var reader = new FileReader();
        reader.onload = function (e: any) {
            setBase64StringFun(e.target.result);
        }.bind(this);
        reader.readAsDataURL(file);
    }

    // 深拷贝函数
    static deepCopy(obj: any) {
        let result: any = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    result[key] = this.deepCopy(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        result.__proto__ = obj.__proto__;
        return result;
    }

    // 生成 guid
    static guid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 日期格式
    // data: 时间
    // fmt: yyyy-MM-dd hh:mm:ss
    static dateFormat(inputDate: Date | string | null, fmt: string = 'yyyy-MM-dd hh:mm:ss') {
        if (!inputDate) {
            return null;
        }

        let date: Date | null = null;

        if (typeof inputDate === 'string') {
            date = new Date(inputDate);
        }
        else {
            date = inputDate;
        }

        let o: any = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                    //日 
            "h+": date.getHours(),                   //小时 
            "m+": date.getMinutes(),                 //分 
            "s+": date.getSeconds(),                 //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // 获取url参数
    static getUrlVariable(urlSearch: string, variable: string) {
        if (!urlSearch) {
            return undefined;
        }

        var query = urlSearch.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return undefined;
    }

    // 生成随机数 0 ~ 1000000
    static random() {
        return Math.round(Math.random() * 1000000)
    }

    // 求和
    static sum(arr: Array<number>) {
        var s = 0;

        for (var i = arr.length - 1; i >= 0; i--) {
            s += arr[i];
        }

        return s;
    }
}