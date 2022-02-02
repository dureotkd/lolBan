const baseServerUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:80"
    : "http://13.209.99.30:8080";

const baseUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:3000"
    : "http://13.209.99.30";

export { baseServerUrl, baseUrl };
