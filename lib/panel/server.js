//Master的web面板
const yuri2=require('yuri2js');
const http=require('http');

module.exports=function (opt) {
    try {
        http.createServer(async function(req,res){
            const ctx=new (require('../ctx'))(req,res,opt);
            const handle=yuri2.requireWithoutCache(__dirname+'/handle');
            await handle(ctx);
            if (!ctx.$res.finished) {
                ctx.$res.headersSent||ctx.$res.writeHead(ctx.res._stateCode, ctx.res._headers);
                ctx.$res.end(Buffer.concat(ctx.res._bodyBuffers)); //未结束响应则立即结束
            }
        }).listen(opt.port);
    }catch (e){
        return e;
    }
};