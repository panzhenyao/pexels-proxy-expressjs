const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

try {
  // 跟踪活动代理请求
  const activeProxyRequests = new Map();

  const apiProxy = createProxyMiddleware({
    target: "https://api.siliconflow.cn/v1/",
    changeOrigin: true,
    pathRewrite: {
      "^/siliconflow": "",
    },
    // 关键配置
    ws: true, // 启用WebSocket支持，增强事件处理
    onProxyReq: (proxyReq, req, res) => {
      // 保存代理请求，以便稍后中止
      activeProxyRequests.set(req, proxyReq);

      // 当客户端连接关闭时，中断代理请求
      req.on("close", () => {
        if (activeRequests.has(req)) {
          const upstreamReq = activeRequests.get(req);
          upstreamReq.abort(); // 主动中断上游请求
          activeRequests.delete(req);
        }
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // 代理响应完成后清理
      proxyRes.on("end", () => {
        activeProxyRequests.delete(req);
      });
    },
    onError: (err, req, res) => {
      console.error("代理错误:", err);
      activeProxyRequests.delete(req);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("代理请求失败");
      }
    },
  });

  app.use("/siliconflow", apiProxy);

  app.listen(3000, () => {
    console.log("启动成功");
  });
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}
