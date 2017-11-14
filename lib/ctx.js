const yuri2 = require('yuri2js');
const Basic = yuri2.yuri2Basic;

class Ctx extends Basic {
    constructor(req, res, opt) {
        super();
        let that = this;
        this.yuri2 = yuri2;
        this.opt = opt; //配置表
        this.dir = opt.dir;
        this.$req = req;
        this.$res = res;
        this.id = yuri2.uuid();
        this.app = opt.app;

        this.isEnable = function (name) {
            return this.opt[name] === true
        };
        this.enable = function (name) {
            this.opt[name] = true;
        };
        this.disable = function (name) {
            this.opt[name] = false;
        };
        this.req = {
            // ctx: this,
            headers: req.headers,
            url: req.url,
            method: req.method,
            ip: req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress,
            isSsl: typeof that.opt['ssl'] === 'object',
            protocol: 'http' + (that.opt.ssl ? 's' : '') + '://',
            host: req.headers.host,
            port: that.opt.port,
        };
        this.req.isLocal = yuri2.yuri2Array.inArray(this.req.ip, ['::1', '127.0.0.1']);
        this.req.origin = this.req.protocol + this.req.host;
        this.req.href = this.req.original + this.req.url;
        this.res = {
            // ctx: this,
            _stateCode: 200,
            _headers: [
                ['Content-Type', 'text/html;charset=utf8']
            ],
            _bodyBuffers: [],
            setState: function (stateCode) {
                this._stateCode = stateCode;
            },
            getState: function () {
                return this._stateCode;
            },
            setHeader: function (header, content, overwrite = true) {
                if (overwrite) {
                    for (let i in this._headers) {
                        if (this._headers[i][0] === header) {
                            this._headers[i] = ['pre-' + this._headers[i][0], this._headers[i][1]];
                        }
                    }
                }
                this._headers.push([header, content])
            },
            setHeaderDownload: function (name = 'download') {
                this.setHeader('Content-Type', 'application/octet-stream');
                this.setHeader('Content-Disposition', `attachment;filename=${name}`);
            },
            setHeaderAjax: function () {
                this.setHeader('Content-Type', 'application/json;charset=utf-8');
            },
            setContentTypeByExt: function (ext) {
                let type = yuri2.getContentTypeByExt(ext);
                this.setHeader('Content-Type', type);
            },
            isHtml: function () {
                let type = null;
                for (let i in this._headers) {
                    let name = this._headers[i][0];
                    if (name === 'Content-Type') {
                        type = this._headers[i][1];
                    }
                }
                return (type && /text\/html/i.test(type));
            },
            send: function (data) {
                if (!isNaN(data)) {
                    data = data + '';
                }
                if (yuri2.isJson(data)) {
                    data = JSON.stringify(data);
                }
                if (!Buffer.isBuffer(data)) {
                    data = new Buffer(data);
                }
                this._bodyBuffers.push(data);
            },
            //清空并输出缓冲区，并返回之前的内容（buffer）
            flush: function () {
                that.$res.headersSent || that.$res.writeHead(this._stateCode, this._headers);
                let buffer = Buffer.concat(this._bodyBuffers);
                if (!that.$res.finished) {
                    that.$res.write(buffer);
                }
                this._bodyBuffers = [];
                return buffer;
            },
            //清空缓冲区，并返回之前的内容（buffer）
            clean: function () {
                let buffer = Buffer.concat(this._bodyBuffers);
                this._bodyBuffers = [];
                return buffer;
            },
            redirect(url, code = 302) {
                this.setState(code);
                this.setHeader('location', url)
            },
        };
    }

    dump(data) {
        this.res.send(yuri2.inspect(data, true));
    }

    log(...data){
        this.app.log(...data);
    }
}

module.exports = Ctx;