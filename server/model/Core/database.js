"use strict";

const mysql = require("mysql");
const db = mysql.createPoolCluster();

db.add("ban", {
  host: "13.124.197.194",
  user: "admin",
  password: "KauKau@1234!",
  database: "ban",
  port: 3306,
});

module.exports.db = db;
