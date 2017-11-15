# yuri2web

Web Server application.

* Main Project https://github.com/yuri2peter/yuri2web
* Issues https://github.com/yuri2peter/yuri2web/issues
* All Projects https://github.com/yuri2peter
* Blog https://yuri2.cn

## Version

0.1.0

## Progress

Refactoring...

>Not recommended for actual project dependencies.
The official version is going to be online.

## Get Start

1. Install modules `npm install yuri2js yuri2web` .
2. Create a simple file then run it.
~~~
const Web=require('yuri2web');
let srv=new Web({
    file:__filename,
    port:8080,
    worker:2,
    password:'yuri2',
    handle:async function (fd) {
        require('http').createServer(function (req,res) {
            res.end("hi~");
        }).listen(fd)
    }
});
srv.run();
~~~

## Global Orders

* version :check the version of yuri2web.

## TODO

* document

## ChangeLog

### v0.1.0

* Single process mode
* Chinese support

### v0.0.2

* Panel for management.

### v0.0.1

* Construction of multi process framework
