const yuri2 = require('yuri2js');

module.exports = async function (ctx, id) {
    await
    new Promise(async function (resolve, reject) {
        const order = `yuri2web.kill()`;
        ctx.opt.app.cpEval(id, order, function (err, data) {
        })
        resolve();
    }).then(function () {
        let data = {
            state: 'success'
        };
        ctx.res.send(data);
    }).catch(function () {
        let data = {
            state: 'error'
        };
        ctx.res.send(data);
    });
}