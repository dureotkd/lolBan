const baseServerUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:8080"
    : "https://api-w1.okpann.com";

const baseUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:3000"
    : "https://lolban.vercel.app";

export { baseServerUrl, baseUrl };
