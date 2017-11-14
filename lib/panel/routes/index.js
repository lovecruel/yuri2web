const yuri2 = require('yuri2js');

module.exports = async function (ctx,token) {
    const file=yuri2.yuri2File;
    let html=file.fileGetContent(__dirname+'/../res/html.html');
    html=html.toString().replace(/\${token}/g,token);
    ctx.res.send(html);
};