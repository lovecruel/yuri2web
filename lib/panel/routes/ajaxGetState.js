const yuri2 = require('yuri2js');
const os = require('os');

module.exports = async function (ctx) {
    await new Promise(async function (resolve, reject) {
        let mems = {};
        for (let i in ctx.app.cps) {
            await new Promise(function (rel, rej) {
                const order = `yuri2web.cpState()`;
                ctx.opt.app.cpEval(i, order, function (err, data) {
                    mems[i] = data;
                    rel();
                })
            });
        }
        resolve(mems);
    }).then(function (mems) {
        let data={
            os:{
                totalmem:os.totalmem(),
                freemem:os.freemem(),
            },
            cps:mems,
            logs:ctx.opt.app.getLogs(),
        };
        ctx.res.send(data);
    });
};