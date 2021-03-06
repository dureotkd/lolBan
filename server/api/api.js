const { router } = require("../http/http");
const crypto = require("crypto");
const moment = require("moment");
const gameModel = require("../model/Game/GameModel");
const champModel = require("../model/Champ/ChampModel");

router.get("/", (req, res) => {
  res.send("Hello RESTFUL API ");
});

router.get("/games", async (req, res) => {
  const { seq, id } = req.query;

  let where = [
    `a.seq = ${seq}`,
    `(a.blueEnName = '${id}' OR a.redEnName = '${id}' OR a.watchEnName = '${id}')`,
  ];

  let sql = `
    SELECT 
      * ,
      CASE 
      WHEN a.blueEnName = '${id}' THEN 'blue' 
      WHEN a.redEnName = '${id}' THEN 'red'
      ELSE 'watch' END as myTeam
    FROM 
      ban.game a
    WHERE %s`.replace("%s", where.join(" AND "));

  const row = await gameModel.getData({
    sql: sql,
    type: "row",
  });

  res.send({
    row,
  });
});

router.get("/champs", async (req, res) => {
  const all = await champModel.getAll();

  res.send({
    all,
  });
});

router.patch("/games", async (req, res) => {
  const { blueName, redName, matchName } = req.query;

  const blueEnKey = `${blueName}_${matchName}`;
  const redEnKey = `${redName}_${matchName}`;
  const watchEnKey = `watch_${matchName}`;
  const lastRow = await gameModel.getLastPk();

  const seq = lastRow === undefined ? 0 : lastRow.seq;
  const newSeq = seq + 1;
  const regDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const blueEnName = crypto
    .createHash("sha512")
    .update(blueEnKey)
    .digest("base64")
    .replaceAll("/", "")
    .replaceAll("?", "")
    .replaceAll("&", "")
    .replaceAll("=", "");
  const redEnName = crypto
    .createHash("sha512")
    .update(redEnKey)
    .digest("base64")
    .replaceAll("/", "")
    .replaceAll("?", "")
    .replaceAll("&", "")
    .replaceAll("=", "");

  const watchEnName = crypto
    .createHash("sha512")
    .update(watchEnKey)
    .digest("base64")
    .replaceAll("/", "")
    .replaceAll("?", "")
    .replaceAll("&", "")
    .replaceAll("=", "");

  await gameModel.save({
    blueName,
    redName,
    matchName,
    blueEnName,
    redEnName,
    watchEnName,
    regDate,
  });

  res.send({
    blueEnName,
    redEnName,
    watchEnName,
    seq: newSeq,
  });
});
