const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

try {
  // 创建一个代理中间件，将以 /photos 开头的请求代理到目标地址
  const apiProxy = createProxyMiddleware({
    target: "https://api.siliconflow.cn/v1/",
    changeOrigin: true, // 设置更改请求头中的 Origin
    pathRewrite: {
      "^/siliconflow": "",
    },
    onProxyRes: function (proxyRes, req, res) {
      // 修改响应头信息，隐藏跳转细节
    },
  });

  // 使用代理中间件来处理以 /photos 开头的请求
  app.use("/siliconflow", apiProxy);

  // 根目录路由处理函数，输出当前时间
  app.get("/", (req, res) => {
    const currentTime = new Date().toLocaleString(); // 获取当前时间
    res.send(`Current time is: ${currentTime}`); // 返回当前时间到客户端
  });

  // 根目录路由处理函数，输出当前时间
  app.post("/", (req, res) => {
    const currentTime = new Date().toLocaleString(); // 获取当前时间
    res.send(`Current time is: ${currentTime}`); // 返回当前时间到客户端
  });

  app.listen(80, () => {
    console.log("启动成功");
  });
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1); // 退出应用并返回非零状态码
}
