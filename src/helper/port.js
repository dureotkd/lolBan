const baseServerUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:8080"
    : "http://211.238.133.10:8080";

const baseUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:3000"
    : "http://211.238.133.10";

export { baseServerUrl, baseUrl };
