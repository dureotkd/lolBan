"use strict";

const mysql = require("mysql");
const db = mysql.createPoolCluster();

db.add("ban", {
  host: "13.209.99.30",
  user: "root",
  password: "@!Slsksh671201!@",
  database: "ban",
  port: 3306,
});

module.exports.db = db;
