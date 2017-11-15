const yuri2 = require('yuri2js');

module.exports = async function (ctx,gets) {
    await yuri2.exec(gets.cmd).then(function (rel) {
        ctx.res.send({output:rel})
    }).catch(function (err) {
        ctx.res.send({output:err})
    })
};