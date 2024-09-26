const baseServerUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:8000"
    : "http://211.238.133.10:8000";

const baseUrl =
  window.location.host.indexOf("localhost") !== -1
    ? "http://localhost:3000"
    : "http://211.238.133.10";

export { baseServerUrl, baseUrl };
