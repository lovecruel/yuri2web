const yuri2 = require('yuri2js');
const Basic = yuri2.yuri2Basic;
const cp = require('child_process');
const net = require('net');
const defines = require('./lib/defines');
const path = require('path');

class App extends Basic {
    constructor(opt) {
        super();
        this.opt = {
            file: path.join(process.cwd(), 'yuri2web.js'),//推荐使用__filename指定，默认为/cwd/yuri2web.js
            dir: process.cwd(),
            port: 8080,
            worker: true,
            autoWorkerReboot: true,
            portPanel: 6753,//面板端口号
            ssl: false,//是否正在使用ssl
            work: null, //(fd)=>....
            terminal:false, //是否启用面板的控制台
            commandHandle: ()=>{}, //命令响应函数
        };
        this.opt = yuri2.jsonMerge(this.opt, opt);
        if (this.opt.worker === true) {
            this.opt.worker = require('os').cpus().length
        } //worker=true，将赋值为cpu的数目
        this.middlewares = [];
        this.workerCounter = 0;//记录累计启动了多少个子进程
        this.workerId = process.env[defines.ENV_WORKER_ID];
        this.runtime = [];
        this.cps = {};
        this.cpEvalCbs = {};//cp eval 的 回调 存储位置
        this.fd = null;//tcp handle fd
        this.logs = [];
    }

    cpEval(id, order, cb) {
        let cp = this.cps[id];
        if (!cp) {
            return false;
        }
        let msgId = yuri2.uuid();
        cp.send({type: defines.TYPE_MSG_EVAL, order: order, id: msgId});
        this.cpEvalCbs[msgId] = cb;
    }

    run() {
        const that = this;

        if (that.opt.worker === false) {
            //单进程模式，不启用worker
            this._startServer(true);
            return;
        }

        //多进程模式
        if (App.isSub()) {
            //监听eval的命令
            process.on('message', function (m) {
                if (m.type === defines.TYPE_MSG_EVAL) {
                    let rel = undefined;
                    let err = undefined;
                    try {
                        rel = eval(m.order);
                    } catch (e) {
                        err = e;
                    }
                    if (typeof rel === 'object' && rel.then && rel.catch) {
                        //TODO 暂时以此判断是一个Promise
                        rel.then(function (data) {
                            process.send({
                                type: defines.TYPE_MSG_EVAL_REL,
                                data: data,
                                err: err,
                                id: m.id,
                            })
                        }).catch(function (err) {
                            process.send({
                                type: defines.TYPE_MSG_EVAL_REL,
                                data: null,
                                err: err,
                                id: m.id,
                            })
                        })
                    } else {
                        process.send({
                            type: defines.TYPE_MSG_EVAL_REL,
                            data: rel,
                            err: err,
                            id: m.id,
                        })
                    }

                }
            });
            const work = require('./lib/worker'); //子进程启动监听
            work({
                app: that,
                isSub: true,
                work: that.opt.work,
            })
        } else {
            this._startServer();
        }

        //主进程
        if (that.isMaster()) {
            that.runAt = new Date(); //记录启动时间
            //启动面板
            let err = require('./lib/panel/server')({port: that.opt.portPanel, app: that, password: that.opt.password});
            if (err) {
                that.log(`panel init failed(check port ${that.opt.portPanel})`)
            } else {
                that.log(`panel : http://localhost:` + that.opt.portPanel );
            }

        }
    }

    log(...data) {
        let pre = `[yuri2web] [${yuri2.yuri2Format.dateFormat()}] [${this.workerId ? this.workerId : '0'}]`;
        this.logs.push(pre + " " + data.toString() + '\n');
        console.log(pre.yellow, ...data)
    }

    getLogs() {
        const logs = this.logs;
        this.logs = [];
        return logs;
    }

    static isSub() {
        return process.env[defines.ENV_IS_SUB];
    }

    isMaster() {
        return !App.isSub() && this.opt.worker
    }

    _startServer(single = false) {
        console.log('app is running.');
        const that = this;

        if(single){
            //单进程模式
            that.opt.work(that.opt.port,{});
            that.log(`website : http://localhost:` + that.opt.port + "/")
            return ;
        }

        //多进程模式
        let tcpServer = net.createServer();
        tcpServer.on('tcp server error', function (err) {
            console.error(err);
        });

        tcpServer.listen(this.opt.port, function () {
            that._startWorkers(tcpServer._handle);
            tcpServer.close();
            that.log(`website : http://localhost:` + that.opt.port + "/")
        });
    }

    _startWorkers(fd) {
        const that = this;
        for (let i = 1; i <= this.opt.worker; i++) {
            that._startWorker(++that.workerCounter, fd)
        }
    }

    _startWorker(id, fd) {
        const that = this;
        let env = {};
        env[defines.ENV_IS_SUB] = true; //子进程标记
        env[defines.ENV_WORKER_ID] = id; //worker id
        let c = cp.fork(that.opt.file, [], {
            cwd: process.cwd(), //修正工作目录
            env: env
        });
        that.cps[id] = c; //存储到进程池
        c.on('exit', function (code, signal) {
            that.log(`worker[${id}] exited.CODE ${code}; SIGNAL ${signal}`);
            delete that.cps[id];// 删除进程池
            if (that.opt.autoWorkerReboot) {
                that.emit("worker_aborted",id,code,signal); //抛出一个事件
                that.log(`Restarting worker...`);
                that._startWorker(++that.workerCounter, that.fd);
            }
        });
        c.on('message', function (m, fd) {
            switch (m.type) {
                case defines.TYPE_MSG_EVAL_REL: {
                    let cbRel = that.cpEvalCbs[m.id];
                    if (cbRel) {
                        cbRel(m.err, m.data);
                    }
                    delete that.cpEvalCbs[m.id];
                    break;
                }
                case defines.TYPE_MSG_HANDLE_BACKUP_REL: {
                    that.fd = fd;
                    break;
                }
            }
        });
        c.send({type: defines.TYPE_MSG_LISTEN, opt: that.opt, id: id, feedback: that.fd === null}, fd);
    }
}

module.exports = App;