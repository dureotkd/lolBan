const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const router = express.Router();

app.use(cors());

/**
 * extended 옵션의 경우,
 * true일 경우, 객체 형태로 전달된 데이터내에서 또다른 중첩된 객체를 허용한다는 말이며,
 * false인 경우에는 허용하지 않음
 */
app.use("/api", express.urlencoded({ extended: false }), router);

module.exports = { http, router };
