"use strict";

const mysql = require("mysql");
const db = mysql.createPoolCluster();

db.add("ban", {
  host: "52.79.106.68",
  user: "root",
  password: "",
  database: "ban",
  port: 3306,
});

module.exports.db = db;
