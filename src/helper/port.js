const baseServerUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:8080"
    : "https://api-w2.sungmin.my";

const baseUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:3000"
    : "https://lolban.vercel.app";

export { baseServerUrl, baseUrl };
