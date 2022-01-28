"use strict";

const Core = require("../Core/index");

class GameModel extends Core {
  constructor(props) {
    super(props);

    this.table = "game";
    this.core = new Core();
  }

  getData({ sql, type }) {
    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: type,
    });

    return res;
  }

  getRow() {
    return "Row";
  }

  getAll() {
    return "All";
  }

  getLastPk() {
    const sql =
      "SELECT a.`seq` FROM ban.`game` a ORDER BY a.`seq` DESC LIMIT 1";

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "row",
    });

    return res;
  }

  save(data) {
    const table = this.table;
    const sql = this.core.getInsertQuery({ table, data });

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "exec",
    });

    return res;
  }
}

const gameModel = new GameModel();

module.exports = gameModel;
