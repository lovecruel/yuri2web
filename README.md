# yuri2web

Web Server application.

* Main Project https://github.com/yuri2peter/yuri2web
* Issues https://github.com/yuri2peter/yuri2web/issues
* All Projects https://github.com/yuri2peter
* Blog https://yuri2.cn

## Version

0.9.0

## Progress

Refactoring...

>Not recommended for actual project dependencies.
The official version is going to be online.

## Get Start

1. Install modules `npm install yuri2js yuri2web` .
2. Create a simple file `yuri2web.js` then run it.
~~~
/** 创建该文件并运行 */
/** Create this file then run.  */

const Web=require('yuri2web');
let srv=new Web({
    port:8080, /** 端口号 默认8080 */
    portPanel: 6753,/** 面板端口号 默认6753 */
    worker:2, /** 工作进程数目1,2,3...(true:根据核心数分配;false:不启用子进程) 默认true */
    autoWorkerReboot: true,/** 是否自动重启宕机的子进程？默认true */
    file:__filename, /** 脚本文件定位，__filename即可 默认文件名为yuri2web.js */
    terminal:true, /** 是否开启管理面板的终端功能 默认false */
    ssl:false, /** 是否正在使用ssl 默认false */

    /**
     * 主进程对命令的响应函数
     * @param sign order 命令
     * */
    stateHandle:function (sign) {
        switch (sign){
            case "help":
                srv.log('You can pre define help information here...'); //你可以在此处预定义帮助信息
                break;
            default:
                srv.log('sign received : '+sign);
                break;
        }
    },

    /**
     * 工作函数
     * @param fd Listener resource 监听资源
     * @param web Auxiliary object 辅助对象
     * @usage 用fd来代替端口参数，例如
     *  http.createServer(function (req,res) {
            res.end("hi~");
        }).listen(fd)
     * @usage web.signHandle=function(sign){...} //针对从面板收到的命令sign，给出响应
     * @usage web.stateHandle=function(){...} //针对从面板收到的查询worker状态的命令，给出响应
     * @usage web.kill() //杀死子进程
     * @usage web.visit() //记录一次访问动作
     * @usage web.leave() //记录一次访客完成动作
     * @usage web.log(text) //控制台和面板打印文本
     * */
    work:async function (fd,web) {
        web.signHandle=function (sign) {
            web.log("sign received : "+sign);
        };
        web.stateHandle=function () {
            return "unclear";
        };
        require('http').createServer(function (req,res) {
            web.visit();
            res.end("hi~");
            web.leave();
        }).listen(fd)
    },
});
srv.run(); /** 启动 */

~~~

## Global Orders

* version :check the version of yuri2web.

## TODO

* document
* remove password

## ChangeLog

### v0.9.0

* DIY your order send to worker
* Code optimization
* fixed a bug about Class Ctx

### v0.1.0

* Single process mode
* Chinese support

### v0.0.2

* Panel for management.

### v0.0.1

* Construction of multi process framework
