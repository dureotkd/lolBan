import axios from "axios";
import io from "socket.io-client";
import { baseServerUrl } from "../../helper/port";
import { connect } from "react-redux";
import DraftView from "../../view/Draft/DarftView";
import { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Draft(props) {
  const { search } = useLocation();
  // const seq = search.split("&")[0].split("=")[1];
  // const id = search.split("&")[1].split("=")[1];
  const { seq, id } = useParams();
  const [draft, setDraft] = useState({});
  const [champAll, setChampAll] = useState([]);
  const [searchLine, setSearchLine] = useState("");
  const [searchName, setSearchName] = useState("");
  const [activeCard, setActiveCard] = useState([]);
  const [socketObj, setSocketObj] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [selectDisabled, setSelectDisabled] = useState(true);
  const [turn, setTurn] = useState(0);
  const [second, setSecond] = useState({
    blue: 60,
    red: 60,
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

  let [watchTeamCnt, setWatchTeamCnt] = useState(0);

  const setBaseDraftCard = () => {
    const cloneCard = { ...card };

    for (let i = 0; i < 5; i++) {
      cloneCard.blue.pick[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
        active: null,
      };
      cloneCard.blue.ban[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
        active: i === 0 ? "active" : null,
      };
      cloneCard.red.pick[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
        active: null,
      };
      cloneCard.red.ban[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
        active: null,
      };
    }

    setCard(cloneCard);
  };

  const getDraft = useCallback(async () => {
    console.log(seq, id);

    await axios({
      method: "get",
      url: `${baseServerUrl}/api/games`,
      params: {
        seq,
        id,
      },
    })
      .then(({ status, data }) => {
        if (status === 200) {
          console.log(data);
          setDraft(data.row);
          setSocket(data.row);
        }
      })
      .catch(() => {})
      .then(() => {
        console.log(`getDraft`);
      });

    await axios({
      method: "get",
      url: `${baseServerUrl}/api/champs`,
      params: {},
    })
      .then(({ status, data }) => {
        if (status === 200) {
          setChampAll(data.all);
        }
      })
      .catch(() => {})
      .then(() => {
        console.log(`getChamps`);
      });
  }, [seq, id]);

  const setSocket = (draftData) => {
    const socket = io(`${baseServerUrl}`);
    setSocketObj(socket);

    const myTeam = draftData.myTeam;

    socket.emit("joinDraft", seq);

    socket.emit("watchDraftState", {
      seq,
      myTeam,
      watchId: draftData.watchEnName,
    });

    socket.emit("startSecond", { seq, second });

    /**
     * ???????????? ???????????????
     */
    socket.on("startSecond", (changeSecond, team) => {
      const cloneSecond = { ...second };

      cloneSecond[team] = changeSecond;

      setSecond(cloneSecond);
    });

    /**
     * ???????????? ???????????????
     */
    socket.on("stopSecond", (changeSecond, team) => {
      const cloneSecond = { ...second };

      cloneSecond[team] = changeSecond;

      setSecond(cloneSecond);
    });

    /**
     * ??????,????????? ????????? ??????
     */
    socket.on("joinDraft", ({ dbCard, dbActiveCard, dbTurn }) => {
      setTurn(dbTurn);
      setActiveCard(dbActiveCard);
      setCard(dbCard);
    });

    /**
     * ????????? ???????????????
     */
    socket.on("startDraft", () => {
      setStartGame(true);
    });

    /**
     * ?????? ???????????????
     */
    socket.on("fullDraft", (watchId) => {
      alert("?????? ??????????????? \n ????????? ????????? ???????????????");
    });

    /**
     * ???????????? ???????????? ???????????????
     */
    socket.on("watchNowCnt", (cnt) => {
      setWatchTeamCnt(cnt);
    });

    /**
     * ????????? ????????? ????????? ???????????????
     */
    socket.on("handleSelectBtn", () => {
      setSelectDisabled(false);
    });

    /**
     * ?????? ??????????????? ???????????????
     */
    socket.on("handlePick", ({ cloneCard }) => {
      setCard(cloneCard);
    });

    /**
     * ?????? ????????? ????????? (LOCK)??? ???????????????
     */
    socket.on("handleSelectPick", ({ cloneCard, turnAdd, cloneActiveCard }) => {
      if (turnAdd === 20) {
        endDraft();
      }

      setActiveCard(cloneActiveCard);
      setCard(cloneCard);
      setTurn(turnAdd);
      setSelectDisabled(true);
    });
  };

  const endDraft = () => {
    alert("????????? ?????????????????????");
  };

  /**
   *
   * @param {*} engName
   * @returns
   */
  const checkNormalPick = (engName) => {
    if (activeCard.includes(engName)) {
      return false;
    }

    const turnTeam = turn % 2 === 0 ? "blue" : "red";

    if (turnTeam !== draft.myTeam) {
      return false;
    }

    return true;
  };

  /**
   *
   * @param {*} param0
   * @returns
   */
  const handlePick = ({ cKey, engName }) => {
    if (!startGame) {
      return;
    }

    const isNormal = checkNormalPick(engName);

    if (!isNormal) {
      return;
    }

    const cloneCard = { ...card };

    socketObj.emit("handlePick", {
      cloneCard,
      cKey,
      engName,
      activeCard,
      isNormal,
      turn,
      seq,
    });
  };

  /**
   *
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

  useEffect(() => {
    setBaseDraftCard();
    getDraft();
  }, [getDraft]);

  /**
   * ?????? ??????
   * @param {*} line
   */
  const handleSearchLine = (line) => {
    const resLine = searchLine === line ? "" : line;
    setSearchLine(resLine);
  };

  /**
   * ????????? ????????? ??????
   * @param {*} event
   */
  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <DraftView
      draft={draft}
      champAll={champAll}
      searchLine={searchLine}
      searchName={searchName}
      card={card}
      watchTeamCnt={watchTeamCnt}
      second={second}
      turn={turn}
      activeCard={activeCard}
      handleSearchLine={handleSearchLine}
      handleSearchName={handleSearchName}
      handleSelectPick={handleSelectPick}
      handlePick={handlePick}
      startGame={startGame}
      selectDisabled={selectDisabled}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Draft);
