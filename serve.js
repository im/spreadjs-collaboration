/* 实例化外部依赖 */
let Koa = require("koa2");
let WebSocket = require("koa-websocket");

/* 实例化 WebSocket, 实例化储存所有上线文数组 并分配监听的端口 */
let app = WebSocket(new Koa());
let ctxs = [];
app.listen(8888);

/* 实现简单的接发消息 */
app.ws.use((ctx, next) => {
    // console.log('ctx: ', ctx);
    /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
    ctxs.push(ctx);
    ctx.websocket.on("message", (message) => {
        // console.log(message);
        for (let i = 0; i < ctxs.length; i++) {
            if (ctx == ctxs[i]) continue;
            ctxs[i].websocket.send(message);
        }
    });
    ctx.websocket.on("close", (message) => {
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index, 1);
    });
});
console.log('启动socket服务 localhost:8888')