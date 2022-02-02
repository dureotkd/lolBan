const baseServerUrl =
  window.location.host.indexOf("localhost") == -1
    ? "http://localhost:8080"
    : "http://www.lolbick.com:8080";

const baseUrl =
  window.location.host.indexOf("localhost") == -1
    ? "http://localhost:3000"
    : "http://www.lolbick.com";

export { baseServerUrl, baseUrl };
