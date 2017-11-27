window.lang={};
lang._lang=(navigator.language || navigator.browserLanguage).toLowerCase();
lang.data={
    "MAIN_STATUS":["Main Status","服务器状态"],
    "MAIN_SWITCH":["Main Switch","监控开关"],
    "MEMORY_USAGE":["Memory Usage","内存占用"],
    "STANDARD_MEMORY_USAGE":["Standard Memory Usage","标准内存占用量"],
    "PARTICLE_SIZE":["Particle Size","记录粒度"],
    "INTERVAL":["Interval","刷新间隔"],
    "OPERATION":["Operation","操作"],
    "PAUSE_ALL":["Pause ALL","全部暂停"],
    "RESUME_ALL":["Resume ALL","全部恢复"],
    "SEND_SIGN":["Send Sign","发送命令"],
    "CLOSE_ALL":["Close ALL","彻底关闭"],
    "STATUS":["status","状态"],
    "RUNNING":["running","运行中"],
    "PAUSED":["paused","已暂停"],
    "RSS":["rss","内存耗用"],
    "HEAP_USED":["heapUsed","堆内存"],
    "ONLINE":["online","在线"],
    "OFFLINE":["offline","离线"],
    "REQUESTED":["requested","累计访问"],
    "KILL":["KILL","关闭进程"],
    "FREE":["free","空闲"],
    "TOTAL":["total","总量"],
    "LOGS":["Logs","日志"],
    "TERMINAL":["Terminal","终端"],
    "CLEAR":["Clear","清空"],
    "CREATE_AT":["Create Date","创建时间"],
    "SURE_TO_KILL":["Are you sure you want to KILL process","您确定要终止进程"],
    "SURE_TO_PAUSE_ALL":["Are you sure you want to pause all workers？","您确定要暂停所有进程吗?"],
    "SURE_TO_RESUME_ALL":["Are you sure you want to resume all workers?","您确定要恢复所有进程吗?"],
    "SURE_TO_CLOSE_ALL":["Are you sure you want to KILL all workers and main process?","您确定终止所有工作进程及守护进程吗?"],
    "ATT_SIGN":["Please input instructions to be sent","请输入需要发送的指令"],
}
window.L=function (key) {
    var isZh=lang._lang==='zh-cn'||lang._lang==='zh-tw';
    if(typeof key==='string'){
        if(!lang.data[key]){return ''}
        return isZh?(lang.data[key][1]):(lang.data[key][0]);
    }else{
        return isZh?(key[1]):(key[0]);
    }

}