const yuri2 = require('yuri2js');
const url = require('url');
module.exports = async function (ctx) {
    let path = url.parse(ctx.req.url);
    let pathname = path.pathname;
    let gets = yuri2.yuri2Format.queryToJson(path.query);
    let psw = (ctx.opt.password);
    let token=yuri2.yuri2String.md5(psw+psw);
    if (psw && gets.token !== token) {
        ctx.res.send("bad auth.wrong password.");
        return;
    }
    switch (path.pathname) {
        case "/ajaxGetState":
            await require('./routes/ajaxGetState')(ctx);
            break;
        case "/ajaxGetPause":
            await require('./routes/ajaxGetPause')(ctx);
            break;
        case "/ajaxGetResume":
            await require('./routes/ajaxGetResume')(ctx);
            break;
        case "/ajaxGetCmd":
            await require('./routes/ajaxGetCmd')(ctx, gets);
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