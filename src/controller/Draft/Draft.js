import axios from "axios";
import io from "socket.io-client";
import { baseServerUrl } from "../../helper/port";
import "../../assets/draft/draft.css";

import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import {
  MatchDisplay,
  PickCard,
  BanCard,
  ChampionList,
} from "../../components/Draft";
import { getRandomNumber, wait } from "../../helper/default";

function Draft(props) {
  const { seq, id } = useParams();
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState({});
  const [champAll, setChampAll] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [turn, setTurn] = useState(0);

  const [activeCard, setActiveCard] = useState([]);

  let [second, setSecond] = useState({
    blue: "",
    red: "",
  });

  const [card, setCard] = useState({
    blue: {
      pick: {},
      ban: {},
    },
    red: {
      pick: {},
      ban: {},
    },
  });

  const [searchLine, setSearchLine] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectDisabled, setSelectDisabled] = useState(true);

  const [socketObj, setSocketObj] = useState(null);

  const [random, setRandom] = React.useState(false);

  const [audioPermission, setAudioPermission] = React.useState(null);
  const [audioObj, setAudioObj] = useState({
    bg: null,
    effect: null,
    sound: null,
  });

  React.useEffect(() => {
    (async () => {
      try {
        requestAudioPermission();

        defaultCardSetUp();

        const champData = await fetchChampData();
        const gameData = await fetchGameData();

        await preloadImages(champData);

        connectSocket(gameData);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestAudioPermission = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      setAudioPermission(context);
    } catch (e) {
      if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError") {
        console.log(
          "오디오 입력 장치를 찾을 수 없습니다. 이어폰을 연결하거나 마이크가 있는지 확인해주세요."
        );
      } else if (
        e.name === "NotAllowedError" ||
        e.name === "PermissionDeniedError"
      ) {
        console.log(
          "오디오 권한이 거부되었습니다. 브라우저 설정을 확인해주세요."
        );
      } else {
        console.log(`오디오 권한 요청 실패: ${e.message}`);
      }
      console.error(`오디오 권한 요청 실패: ${e}`);
    }
  }, []);

  const defaultCardSetUp = useCallback(() => {
    setCard((prev) => {
      const clonePrev = { ...prev };

      for (let i = 0; i < 5; i++) {
        clonePrev.blue.ban[i] = {
          img: null,
          lock: false,
          name: null,
          active: i === 0 ? "active" : null,
        };
        clonePrev.blue.pick[i] = {
          img: null,
          lock: false,
          name: null,
          active: null,
        };

        clonePrev.red.ban[i] = {
          img: null,
          lock: false,
          name: null,
          active: null,
        };

        clonePrev.red.pick[i] = {
          img: null,
          lock: false,
          name: null,
          active: null,
        };
      }

      return clonePrev;
    });
  }, []);

  const fetchGameData = useCallback(async () => {
    const {
      data: { row },
    } = await axios({
      url: `${baseServerUrl}/api/games`,
      params: {
        seq,
        id,
      },
    });
    setDraft(row);

    return row;
  }, [id, seq]);

  const fetchChampData = useCallback(async () => {
    const {
      data: { all },
    } = await axios({
      url: `${baseServerUrl}/api/champs`,
    });

    setChampAll(all);

    return all;
  }, []);

  const preloadImages = React.useCallback(async (images) => {
    const promises = images.map(({ engName }) => {
      return new Promise((resolve, reject) => {
        const splashImg = new Image();
        const iconImg = new Image();

        splashImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${engName}_0.jpg`;
        splashImg.onload = resolve;
        splashImg.onerror = reject;

        iconImg.src = `https://opgg-static.akamaized.net/meta/images/lol/14.13.1/champion/${engName}.png`;
        iconImg.onload = resolve;
        iconImg.onerror = reject;
      });
    });

    return Promise.all(promises);
  }, []);

  const connectSocket = React.useCallback(
    (draft) => {
      const socket = io(`${baseServerUrl}`);
      setSocketObj(socket);

      const myTeam = draft.myTeam;

      socket.emit("joinDraft", seq);

      socket.emit("watchDraftState", {
        seq,
        myTeam,
        watchId: draft.watchEnName,
      });

      /**
       * 블루,레드팀 참여자 확인
       */
      socket.on("CheckForOngoingGame", ({ dbCard, dbActiveCard, dbTurn }) => {
        setTurn(dbTurn);
        setActiveCard(dbActiveCard);
        setCard(dbCard);
      });

      /**
       * 대전을 시작합니다
       */
      socket.on("startDraft", async () => {
        // const bgAudio = new Audio(`${process.env.PUBLIC_URL}/sound/bg.mp3`);
        // await bgAudio.play();

        setStartGame(true);

        const cloneCard = { ...card };
        socket.emit("startSecond", { seq, turn, second, cloneCard });
      });

      socket.on("startSecond", (cloneSecond) => {
        // setSecond(second--);

        setSecond(cloneSecond);
      });

      socket.on("endSecond", async () => {});

      /**
       * 방이 꽉찼습니다
       */
      // socket.on("fullDraft", (watchId) => {
      //   alert("방이 꽉찼습니다 \n 관전자 모드로 변경합니다");
      // });

      /**
       * 챔피언 셀렉트 버튼을 제어합니다
       */
      socket.on("handleSelectBtn", () => {
        setSelectDisabled(false);
      });

      /**
       * 밴픽 소켓통신을 제어합니다
       */
      socket.on("handlePick", ({ cloneCard }) => {
        setCard(cloneCard);
      });

      /**
       * 밴픽 챔피언 셀렉트 (LOCK)을 제어합니다
       */
      socket.on(
        "handleSelectPick",
        ({ cloneCard, turnAdd, cloneActiveCard }) => {
          if (turnAdd === 20) {
            endDraft();
          }

          setActiveCard(cloneActiveCard);
          setCard(cloneCard);
          setTurn(turnAdd);
          setSelectDisabled(true);
        }
      );
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seq]
  );

  const endDraft = () => {
    alert("게임이 종료되었습니다");
  };

  const checkPick = async (engName) => {
    // * 이미 선택한 챔피언은 false ✔️
    if (activeCard.includes(engName)) {
      return false;
    }

    const { data } = await axios({
      url: `${baseServerUrl}/api/game/turn`,
      params: {
        turn: turn,
      },
    });

    if (data !== draft.myTeam) {
      return false;
    }

    return true;
  };

  const handlePick = async ({ engName }) => {
    if (!startGame) {
      return;
    }

    if (!(await checkPick(engName))) {
      return;
    }

    if (audioObj.effect) {
      audioObj.effect.pause();
    }

    if (audioObj.sound) {
      audioObj.sound.pause();
    }

    const cloneCard = { ...card };
    const newAudioObj = { ...audioObj };

    const folderName = turn >= 9 ? "pick" : "ban";

    const soundAudio = new Audio(
      `${process.env.PUBLIC_URL}/sound/${folderName}/${engName}.ogg`
    );

    if (folderName === "pick") {
      const effectAudio = new Audio(
        `${process.env.PUBLIC_URL}/sound/${folderName}/${engName}_SFX.ogg`
      );

      newAudioObj.effect = effectAudio;

      effectAudio.volume = 0.8;
      effectAudio.play();
    }

    soundAudio.play();
    newAudioObj.sound = soundAudio;
    setAudioObj(newAudioObj);

    socketObj.emit("handlePick", {
      cloneCard,
      engName,
      turn,
      seq,
    });
  };

  /**
   * 현재 픽을 고정 [선택함]
   */
  const handleSelectPick = () => {
    const cloneCard = { ...card };
    const cloneActiveCard = [...activeCard];

    socketObj.emit("handleSelectPick", {
      cloneCard,
      cloneActiveCard,
      turn,
      seq,
    });
  };

  /**
   * 라인 검색
   * @param {*} line
   */
  const handleSearchLine = (line) => {
    const resLine = searchLine === line ? "" : line;
    setSearchLine(resLine);
  };

  /**
   * 챔피언 텍스트 검색
   * @param {*} event
   */
  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  if (loading) {
    return <div>Hello.</div>;
  }

  return (
    <>
      <MatchDisplay
        blueName={draft.blueName}
        redName={draft.redName}
        blueSecond={second.blue}
        redSecond={second.red}
      />
      <PickCard blue={card.blue.pick} red={card.red.pick} />
      <BanCard blue={card.blue.ban} red={card.red.ban} />
      <ChampionList
        champAll={champAll}
        handlePick={handlePick}
        handleSelectPick={handleSelectPick}
        handleSearchLine={handleSearchLine}
        handleSearchName={handleSearchName}
        selectDisabled={selectDisabled}
        activeCard={activeCard}
        startGame={startGame}
        searchName={searchName}
        searchLine={searchLine}
      />
    </>
  );
}

export default Draft;
