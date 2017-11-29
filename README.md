# yuri2web

这是一个很易用的Node.js包，让你的web应用能利用上所有的服务器CPU,从而提升性能。

This is a very easy to use Node.js package to make your web service code take advantage of all the server CPU to improve performance.

![Image text](https://github.com/yuri2peter/yuri2web/raw/master/docRes/panel.png)


* 项目地址 Main Project https://github.com/yuri2peter/yuri2web
* 问题反馈 Issues https://github.com/yuri2peter/yuri2web/issues
* 开源中国 https://www.oschina.net/p/yuri2web
* NPM https://www.npmjs.com/package/yuri2web
* 其它项目 All Projects https://github.com/yuri2peter
* Blog https://yuri2.cn

## 版本 Version

0.9.4 Beta

## 为什么我需要它？Why I Need This?
* 理论上支持任何需要监听某一个网络端口的应用，实测兼容常见的web框架（如express,koa）。
* In theory, it is compatible with any application that needs to monitor a certain port, and is measured to be compatible with the mainstream web server framework (such as express, KOA).
* 比起其它同类应用（如PM2），你可以用简单的方式对worker进行基本控制，而不是只能被动的查看它们的状态。
* Compared with other similar applications (such as PM2), you can simply control the worker in a simple way, rather than only passively view their state.

## 特性 Features

* 中英双语支持。
* Chinese / English language support.
* 不基于cluster机制。
* Not based on cluster.
* 挂掉的工作进程可以被自动重启。
* The process of accidental death can be restarted automatically.
* 实时监控工作进程的状态，并提供图表。
* Monitor the working state of each work process in real time and provide a chart.
* 通过浏览器访问管理面板，你可以向工作进程发送指令（如状态简报、暂停服务、杀死进程）。
* Use your browser to access the management panel to publish commands to the working process (statistics reports, pause, kill...).
* 管理面板也可访问终端（慎用）。
* Use the management panel to access the terminal(caution).

## 注意 Attention

此项目发布时间不长，也许有尚未发现的bug，因此目前不建议在正式项目中使用。

This project has not been released for long time, and there may be undiscovered bug, which is not recommended for use in official projects by now.

## 快速开始 Quick Start

1. 安装模块 Install modules `npm install yuri2js yuri2web` .
2. 创建文件`yuri2web.js`然后运行它。Create a simple file `yuri2web.js` then run it.
~~~
/** 创建该文件并运行 */
/** Create this file then run.  */

const Web=require('yuri2web');
let srv=new Web({
    /** 端口号 默认8080 */
    /** Port. Default 8080 */
    port:8080,

    /** 面板端口号 默认6753 */
    /** Panel port. Default 6753 */
    portPanel: 6753,

    /** 工作进程数目1,2,3...(true:根据核心数分配;false:不启用子进程) 默认true */
    /** Number of worker processes 1,2,3...(true:according to the CPU core number distribution;false:no child process enabled) default value:true */
    worker:2,

    /** 是否自动重启宕机的子进程？默认true */
    /** Whether the automatic restart downtime process? Default true */
    autoWorkerReboot: true,

    /** 脚本文件定位，__filename即可 */
    /** Script file location, set to "__filename" */
    file:__filename,

    /** 是否开启管理面板的终端功能 默认false */
    /** Whether to open the terminal of the management panel. Default false. */
    terminal:true,

    /** 是否正在使用ssl 默认false */
    /** Whether SSL is being used. Default false. */
    ssl:false,

    /**
     * 主进程对命令的响应函数
     * The response function of the master process to the command
     * @param command string  命令 command
     * */
    commandHandle:function (command) {
        switch (command){
            case "help":
                srv.log('You can pre define help information here...'); //你可以在此处预定义帮助信息
                break;
            default:
                srv.log('command received : '+command);
                break;
        }
    },

    /**
     * 工作函数
     * @param fd 监听资源 Listener resource
     * @param web 辅助对象 Auxiliary object
     * @usage 用fd来代替端口参数 Replacing port parameters with fd
     *  http.createServer(function (req,res) {
            res.end("hi~");
        }).listen(fd)
     * @usage web.commandHandle=function(command){...} //针对从面板收到的命令command，给出响应 Give a response to the command command received from the panel.
     * @usage web.stateHandle=function(){...} //针对从面板收到的查询worker状态的命令，给出响应 Give a response to a command to query worker status received from the panel.
     * @usage web.kill() //安全杀死子进程 Kill the child process safely.
     * @usage web.getId() //获取当前worker的id Get the ID of the current worker.
     * @usage web.visit() //记录一次访问动作 Record a request.
     * @usage web.leave() //记录一次访问完成动作 Record a request complete action.
     * @usage web.log(text) //控制台和面板打印文本 Console and panel print text.
     * */
    work:async function (fd,web) {
        web.commandHandle=function (command) {
            web.log("command received : "+command);
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
srv.run(); /** 启动 Run */

~~~


## 全局命令 Global Command

* version :打印该项目版本。Check the version of this project.

## TODO

* document

## ChangeLog

### v0.9.4

* Demo and documents.

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
