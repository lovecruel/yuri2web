const yuri2 = require('yuri2js');
const os = require('os');

module.exports = async function (ctx,sign) {
    await new Promise(async function (resolve, reject) {
        for (let i in ctx.opt.app.cps) {
            await new Promise(function (rel, rej) {
                const order = `yuri2web.cpSend(\`${sign}\`)`;
                ctx.opt.app.cpEval(i, order, function (err, data) {
                    rel()
                })
            });
        }
        resolve();
    }).then(function () {
        let data={
            state:'success'
        };
        ctx.res.send(data);
    }).catch(function () {
        let data={
            state:'error'
        };
        ctx.res.send(data);
    });
};