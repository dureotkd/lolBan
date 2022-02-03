"use strict";

const Core = require("../Core/index");

class ChampModel extends Core {
  constructor(props) {
    super(props);

    this.table = "champs";
    this.core = new Core();
  }

  getData() {}

  getRow() {}

  getRowByPk(seq) {


  }

  getAll() {
    const sql = "SELECT * FROM ban.`champ`";

    const res = this.core.excute({
      database: "ban",
      sql: sql,
      type: "all",
    });

    return res;
  }
}

const champModel = new ChampModel();

module.exports = champModel;
