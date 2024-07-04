const ip = require("ip");
const moment = require("moment");
const { http } = require("../http/http");
const draftDetailModel = require("../model/DraftDetail/DraftDetailModel");
const io = require("socket.io")(http, {
  // transport: ["websocket"],
  cors: { origin: "*" },
});

const { getNextTurnIndex, getTurnTeam } = require("../helper/card-helper");
const { empty } = require("../../src/helper/default");
const champModel = require("../model/Champ/ChampModel");

const rooms = {};
const watch = {};
let intervalObj = {};

io.on("connection", (socket) => {
  console.log(`소켓 서버가 연결되었습니다 👨`);

  const socketId = socket.id;

  socket.on("joinDraft", async (seq) => {
    socket.join(seq);

    const draftDetailRow = await draftDetailModel.getRowByPk(seq);

    if (draftDetailRow) {
      const dbCard = JSON.parse(draftDetailRow.card);
      const dbActiveCard = JSON.parse(draftDetailRow.activeCard);
      const dbTurn = draftDetailRow.turn;

      io.to(socketId).emit("CheckForOngoingGame", {
        dbCard,
        dbActiveCard,
        dbTurn,
      });
    }
  });

  socket.on("watchDraftState", ({ seq, myTeam, watchId }) => {
    switch (myTeam) {
      case "blue":
        if (rooms[socketId] === undefined) {
          rooms[socketId] = `${seq}_${myTeam}`;
        }

        break;

      case "red":
        if (rooms[socketId] === undefined) {
          rooms[socketId] = `${seq}_${myTeam}`;
        }

        break;

      default:
        break;

      case "watch":
        if (watch[socketId] === undefined) {
          watch[socketId] = seq;
        }
        break;
    }

    const nowPlayer = Object.values(rooms).reduce((before, after) => {
      const playerRoomSeq = after.split("_")[0];

      return {
        ...before,
        [playerRoomSeq]: before[playerRoomSeq]
          ? (before[playerRoomSeq] += 1)
          : 1,
      };
    }, {});

    const nowPlayerCnt = nowPlayer[seq] ? nowPlayer[seq] : 0;

    if (nowPlayerCnt > 2) {
      io.to(socketId).emit("fullDraft", watchId);
    }

    if (nowPlayerCnt === 2) {
      io.to(seq).emit("startDraft");
    }

    const watchNow = Object.values(watch).reduce((before, after) => {
      return {
        ...before,
        [after]: before[after] ? before[after] + 1 : 1,
      };
    }, {});

    const watchNowCnt = watchNow[seq];

    io.to(seq).emit("watchNowCnt", watchNowCnt);
  });

  /**
   * 1. 블루팀 시작
   * 2. 레드팀 시작
   *
   * - 처음 게임 시작시 30초
   * => 픽 안할 경우 랜덤 챔피언 SELECT
   *
   * - 픽 할 경우 30초 다시 초기화
   *
   */
  // socket.on("startSecond", async ({ seq, turn, second, cloneCard }) => {
  //   const turnTeam = getTurnTeam(turn);
  //   if (!empty(intervalObj)) {
  //     clearInterval(intervalObj);
  //   }
  //   let s = 2;

  //   intervalObj = setInterval(async () => {
  //     const cloneSecond = { ...second };
  //     cloneSecond[turnTeam] = s;
  //     console.log(s);
  //     if (s < 0) {
  //       console.log(turn);

  //       const turnTeam = getTurnTeam(turn);
  //       const turnAction = turn < 10 ? "ban" : "pick";
  //       const turnCard = cloneCard[turnTeam][turnAction];

  //       const champAll = await champModel.getAll();

  //       console.log(champAll)

  //       for (const key in turnCard) {
  //         if (!turnCard[key].lock) {
  //           const numberKey = Number(key);

  //           cloneCard[turnTeam][turnAction][numberKey] = {
  //             img: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${engName}_0.jpg`,
  //             lock: false,
  //             name: engName,
  //           };

  //           break;
  //         }
  //       }

  //       // io.to(socketId).emit("handleSelectBtn");

  //       // io.to(seq).emit("handlePick", {
  //       //   cloneCard,
  //       // });

  //       clearInterval(intervalObj);
  //     } else {
  //       io.to(seq).emit("startSecond", cloneSecond);
  //     }
  //     s--;
  //   }, 1000);
  // });

  socket.on("handlePick", ({ cloneCard, engName, turn, seq }) => {
    const turnTeam = getTurnTeam(turn);
    const turnAction = turn < 10 ? "ban" : "pick";
    const turnCard = cloneCard[turnTeam][turnAction];

    for (const key in turnCard) {
      if (!turnCard[key].lock) {
        const numberKey = Number(key);

        cloneCard[turnTeam][turnAction][numberKey] = {
          img: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${engName}_0.jpg`,
          lock: false,
          name: engName,
        };

        break;
      }
    }

    io.to(socketId).emit("handleSelectBtn");

    io.to(seq).emit("handlePick", {
      cloneCard,
    });
  });

  // 1 2 2

  socket.on(
    "handleSelectPick",
    async ({ cloneCard, cloneActiveCard, turn, seq }) => {
      const turnTeam = getTurnTeam(turn);
      const turnAdd = turn + 1;

      const turnAction = turn < 10 ? "ban" : "pick";

      const turnCard = cloneCard[turnTeam][turnAction];

      const lastKey = Object.keys(turnCard)
        .filter((key) => turnCard[key].img)
        .reduce(
          (max, key) => Math.max(max, Number(key)),
          Number.MIN_SAFE_INTEGER
        );

      // * 0 blue

      // * 2 red
      // console.log(turn, turnTeam);

      // 현재 픽되었으니까 LOCK ========================

      const engName = cloneCard[turnTeam][turnAction][lastKey]["name"];
      cloneCard[turnTeam][turnAction][lastKey]["lock"] = true;
      cloneActiveCard.push(engName);

      // 현재 픽되었으니까 LOCK ========================

      // 다음 KEY 값을 찾아줌 ========================

      const turnReverseTeam = getTurnTeam(turnAdd);
      const nextTurnIndex = getNextTurnIndex(turnAdd);

      // 다음 KEY 값을 찾아줌 ========================

      const isLastBan = turn === 9 ? true : false;
      const isLastPick = turn === 19 ? true : false;

      if (isLastBan) {
        cloneCard["blue"]["pick"][0].active = "active";
      } else if (!isLastPick) {
        cloneCard[turnReverseTeam][turnAction][nextTurnIndex].active = "active";
      }

      console.log(turn);

      // console.log(JSON.stringify(cloneCard, null, 2));

      const draftDetailRow = await draftDetailModel.getRowByPk(seq);
      const regDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const procType = draftDetailRow ? "UPDATE" : "INSERT";

      const procData = {
        draftSeq: seq,
        card: JSON.stringify(cloneCard),
        activeCard: JSON.stringify(cloneActiveCard),
        turn: turnAdd,
        regDate: regDate,
        regIp: ip.address(),
      };

      switch (procType) {
        case "UPDATE":
          const procWhere = [1, `draftSeq = ${seq}`];

          await draftDetailModel.update(procData, procWhere);

          break;

        case "INSERT":
          await draftDetailModel.save(procData);

          break;

        default:
          break;
      }

      io.to(seq).emit("handleSelectPick", {
        cloneCard,
        turnAdd,
        cloneActiveCard,
      });
    }
  );

  socket.on("disconnect", () => {
    delete rooms[socketId];
    delete watch[socketId];

    console.log(`소켓 서버가 종료되었습니다 👩 🦳`);
  });
});
