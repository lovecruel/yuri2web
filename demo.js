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
