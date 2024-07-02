"use strict";

const mysql = require("mysql");
const db = mysql.createPoolCluster();

db.add("ban", {
  host: "211.238.133.10",
  user: "root",
  password: "@slsksh33@",
  database: "ban",
  port: 3306,
});

module.exports.db = db;
