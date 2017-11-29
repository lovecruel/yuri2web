const defines = require('./defines');
const yuri2 = require('yuri2js');
const work = function (opt) {
    const app = opt.app;

    //适合子进程的一些函数
    global.yuri2web||(global.yuri2web = {
        _online: 0,
        _requested: 0,
        _creatAt:new Date(),
        log(...data){
            app.log(...data);
        },
        getId(){
            return app.workerId;
        },
        cpState() {
            return yuri2.jsonMerge(process.memoryUsage(), {
                pid: process.pid,
                online: this._online,
                requested: this._requested,
                state: this.stateHandle(),
                logs: app.getLogs(),
                createAt:this._creatAt.getTime(),
            })
        },
        stateHandle(){
            return "undefined";
        },
        cpSend(sign){
            //接收sign命令
            this.commandHandle(sign);
        },
        commandHandle(){
            return "undefined";
        },
        kill() {
            const that=this;
            this.paused = true;
            //安全关闭
            setInterval(function () {
                if (that._online <= 0) {
                    process.exit(0)
                }
            }, 200);
            //30秒强制关闭
            setTimeout(function () {
                process.exit(0);
            }, 30000)
        },
        visit(){
            this._requested++;
            this._online++;
        },
        leave(){
            this._online--;
        },
    });

    if (opt.isSub) {
        //主进程发送启动命令
        process.on('message', function (m, fd) {
            switch (m.type) {
                case defines.TYPE_MSG_LISTEN: {
                    opt.work(fd,global.yuri2web);
                    !m.feedback || process.send({type: defines.TYPE_MSG_HANDLE_BACKUP_REL}, fd);
                    opt.app.log(`listening...`);
                    break;
                }
            }
        });
        process.on('uncaughtException', function (err) {
            yuri2web.log(err);
            setTimeout(function () {
                process.exit(1);
            }, 3000)
        });

    }
};

module.exports = work;