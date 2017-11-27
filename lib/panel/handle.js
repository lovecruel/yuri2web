const yuri2 = require('yuri2js');
const url = require('url');
const token= yuri2.uuid();

let flagFirst=true;

module.exports = async function (ctx) {
    let path = url.parse(ctx.req.url);
    let pathname = path.pathname;
    let gets = yuri2.yuri2Format.queryToJson(path.query);
    if((path.pathname==='/') && flagFirst){
        //第一次启动自动跳转到带token的url
        flagFirst=false;
        ctx.res.redirect(ctx.req.href+"?token="+token);
        return;
    }

    if (gets.token !== token) {
        ctx.res.send("bad auth.wrong password.");
        return;
    }
    switch (path.pathname) {
        case "/ajaxGetState":
            await require('./routes/ajaxGetState')(ctx);
            break;
        case "/ajaxGetSendAll":
            ctx.app.opt.stateHandle(gets.sign);//给主进程也发送命令
            await require('./routes/ajaxGetSendAll')(ctx,gets.sign);//子进程
            break;
        case "/ajaxGetCmd":
            if(ctx.app.opt.terminal){
                await require('./routes/ajaxGetCmd')(ctx, gets);
            }else{
                ctx.res.send({output:'The terminal is disabled.Set "terminal" to "true" to enable.\n'});
            }
            break;
        case "/ajaxGetKill":
            await require('./routes/ajaxGetKill')(ctx, gets.id);
            break;
        case "/ajaxGetCloseAll":
            await require('./routes/ajaxGetCloseAll')(ctx);
            break;
        case "/ajaxGetPing":
            ctx.res.send({createAt:ctx.app.runAt.getTime()})
            break;
        case "/":
            await require('./routes/index')(ctx,token);
            break;
        default:
            await require('./routes/static')(ctx,pathname);
            break;
    }
};