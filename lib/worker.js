const defines = require('./defines');
const yuri2 = require('yuri2js');
const work = function (opt) {
    let app = opt.app;

    //适合子进程的一些函数
    global.yuri2web||(global.yuri2web = {
        _online: 0,
        _requested: 0,
        _paused: false,
        _creatAt:new Date(),
        log(...data){
            app.log(...data);
        },
        cpState() {
            return yuri2.jsonMerge(process.memoryUsage(), {
                pid: process.pid,
                online: this._online,
                requested: this._requested,
                paused: this._paused,
                logs: app.getLogs(),
                createAt:this._creatAt.getTime(),
            })
        }
        ,
        cpPause() {
            this._paused = true;
        }
        ,
        cpResume() {
            this._paused = false;
        }
        ,
        kill() {
            const that=this;
            this.paused = true;
            //安全关闭
            setInterval(function () {
                if (that._online <= 0) {
                    process.exit(0)
                }
            }, 200)
            //30秒强制关闭
            setTimeout(function () {
                process.exit(0);
            }, 30000)
        }
        ,
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
                    opt.handle(fd);
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

    } else {
        opt.listen(opt.handle);
    }
};

module.exports = work;