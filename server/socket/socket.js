const { http } = require("../http/http");
const io = require("socket.io")(http, {
  // transport: ["websocket"],
  cors: { origin: "*" },
});

const rooms = {};
const watch = {};
const intervalControl = {
  obj: null,
  start: (seq, second, team) => {
    if (this.obj !== undefined) {
      clearInterval(this.obj);
      io.to(seq).emit("stopSecond", second, team);
    }
    this.obj = setInterval(() => {
      second--;

      io.to(seq).emit("startSecond", second, team);
    }, 1000);
  },
};

io.on("connection", (socket) => {
  console.log(`소켓 서버가 연결되었습니다 👨`);

  const socketId = socket.id;

  socket.on("joinDraft", (seq) => {
    socket.join(seq);
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

  socket.on("startSecond", async ({ seq, second }) => {
    // intervalControl.start(seq, second["blue"], "blue");
    // await wait(10000);
    // intervalControl.start(seq, second["red"], "red");
    // await wait(10000);
  });

  socket.on(
    "handlePick",
    ({ cloneCard, cloneActiveCard, cKey, engName, turn, seq }) => {
      const turnTeam = turn % 2 === 0 ? "blue" : "red";
      const turnReverseTeam = turnTeam === "blue" ? "red" : "blue";
      const turnAction = turn < 10 ? "ban" : "pick";
      const turnAdd = turn + 1;
      const turnCard = cloneCard[turnTeam][turnAction];

      for (const key in turnCard) {
        if (!turnCard[key].code) {
          const numberKey = Number(key);

          cloneCard[turnTeam][turnAction][numberKey] = {
            tmpKey: cKey,
            img: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${engName}_0.jpg`,
            code: cKey,
            name: engName,
          };

          let nextActiveKey = turnAdd % 2 === 0 ? numberKey + 1 : numberKey;

          if (nextActiveKey > 4) {
            nextActiveKey--;
          }

          const isLastBan = turn === 9 ? true : false;

          switch (isLastBan) {
            case true:
              cloneCard["blue"]["pick"][0].active = "active";

              break;

            default:
              cloneCard[turnReverseTeam][turnAction][nextActiveKey].active =
                "active";

              break;
          }

          break;
        }
      }

      cloneActiveCard.push(engName);

      io.to(seq).emit("handlePick", {
        cloneCard,
        turnAdd,
        engName,
        turnTeam,
        turnAction,
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
