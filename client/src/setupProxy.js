const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:3001",
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    createProxyMiddleware("/advice", {
      target: "https://api.adviceslip.com",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/weather", {
      target: "https://api.openweathermap.org/data/2.5/",
      changeOrigin: true,
    })
  );
};
