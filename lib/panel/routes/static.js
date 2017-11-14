const yuri2 = require('yuri2js');
const fs=yuri2.yuri2File;

module.exports = async function (ctx,pathname) {
    let file=__dirname+'/../res'+pathname;
    if(fs.isFile(file)){
        let ext=require('path').extname(file);
        let content=fs.fileGetContent(file);
        ctx.res.setContentTypeByExt(ext);
        ctx.res.send(content);
    }else {
        ctx.res.send("404 NOT FOUND");
    }
};