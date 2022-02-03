"use strict";

const Core = require("../Core/index");

class DraftDetailModel extends Core {
  constructor(props) {
    super(props);

    this.table = "draftDetail";
    this.core = new Core();
  }

  getData() {}

  getRow() {}

  getRowByPk(seq) {
    const sql = `SELECT * FROM ban.${this.table} a WHERE a.draftSeq = '${seq}'`;

    const row = this.core.excute({
      database: "ban",
      sql: sql,
      type: "row",
    });

    return row;
  }

  getAll() {
    const sql = "SELECT * FROM ban.`draftDetail`";

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "all",
    });

    return res;
  }

  save(data) {
    const sql = this.core.getInsertQuery({ table: this.table, data });

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "exec",
    });

    return res;
  }

  update(data, where) {
    const sql = this.core.getUpdateQuery({ table: this.table, data, where });

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "exec",
    });

    return res;
  }
}

const draftDetailModel = new DraftDetailModel();

module.exports = draftDetailModel;
