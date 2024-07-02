import axios from "axios";
import io from "socket.io-client";
import { baseServerUrl } from "../../helper/port";
import { connect } from "react-redux";
import "../../assets/draft/draft.css";

import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Draft(props) {
  const { seq, id } = useParams();
  const { search } = useLocation();
  // const seq = search.split("&")[0].split("=")[1];
  // const id = search.split("&")[1].split("=")[1];
  const [loading, setLoading] = useState(true);
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

  React.useEffect(() => {
    (async () => {
      try {
        defaultCardSetUp();

        await fetchGameData();

        await fetchChampData();

        connectSocket();
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultCardSetUp = useCallback(() => {
    setCard((prev) => {
      const clonePrev = { ...prev };

      for (let i = 0; i < 5; i++) {
        clonePrev.blue.pick[i] = {
          tmpKey: `blue-pick-${i}`,
          code: null,
          name: null,
          img: null,
          active: null,
        };
        clonePrev.blue.ban[i] = {
          tmpKey: `blue-ban-${i}`,
          code: null,
          name: null,
          img: null,
          active: i === 0 ? "active" : null,
        };
        clonePrev.red.pick[i] = {
          tmpKey: `red-pick-${i}`,
          code: null,
          name: null,
          img: null,
          active: null,
        };
        clonePrev.red.ban[i] = {
          tmpKey: `red-ban-${i}`,
          code: null,
          name: null,
          img: null,
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
  }, [id, seq]);

  const fetchChampData = useCallback(async () => {
    const {
      data: { all },
    } = await axios({
      url: `${baseServerUrl}/api/champs`,
    });

    setChampAll(all);
  }, []);

  const connectSocket = React.useCallback(() => {
    const socket = io(`${baseServerUrl}`);
    setSocketObj(socket);

    socket.emit("joinDraft", seq);

    /**
     * 블루,레드팀 참여자 확인
     */
    socket.on("joinDraft", ({ dbCard, dbActiveCard, dbTurn }) => {
      setTurn(dbTurn);
      setActiveCard(dbActiveCard);
      setCard(dbCard);
    });

    /**
     * 대전을 시작합니다
     */
    socket.on("startDraft", () => {
      setStartGame(true);
    });

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
    socket.on("handleSelectPick", ({ cloneCard, turnAdd, cloneActiveCard }) => {
      if (turnAdd === 20) {
        endDraft();
      }

      setActiveCard(cloneActiveCard);
      setCard(cloneCard);
      setTurn(turnAdd);
      setSelectDisabled(true);
    });
  }, [seq]);

  const endDraft = () => {
    alert("게임이 종료되었습니다");
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
    console.log("loading");
    return <div>Hello.</div>;
  }

  return (
    <>
      <MatchDisplay blueName={draft.blueName} redName={draft.redName} />
      <PickCard blue={card.blue.pick} red={card.red.pick} />
      <BanCard blue={card.blue.ban} red={card.red.ban} />
    </>
  );
}

const MatchDisplay = React.memo(({ blueName, redName }) => {
  return (
    <div className="contents">
      <div className="competion">
        <div className="flex al-c js-c">
          <div className="team-wrap">
            <h1 className="f-23 ml-12">{blueName}</h1>
            <div className="team-img"></div>
          </div>
          <div className="team-wrap">
            <div className="team-img red-team"></div>
            <h1 className="f-23 mr-12">{redName}</h1>
          </div>
        </div>
      </div>
    </div>
  );
});

const PickCard = React.memo(({ blue, red }) => {
  console.log("bye");
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {blue &&
          Object.values(blue).map(({ tmpKey, active }, key) => {
            return (
              <div className="pick" key={tmpKey}>
                <div className="pick-image blue-team-card">
                  <span className={active}></span>
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
      <div className="team-picks">
        {red &&
          Object.values(red).map(({ tmpKey, active }, key) => {
            return (
              <div className="pick" key={tmpKey}>
                <div className="pick-image red-team-card aa">
                  <span className={active}></span>
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
});

const BanCard = React.memo(({ blue, red }) => {
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {blue &&
          Object.values(blue).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="ben-pick-image blue-team-card">
                  <span className={value.active}></span>
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
      <div className="team-picks">
        {red &&
          Object.values(red).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="ben-pick-image red-team-card">
                  <span className={value.active}></span>
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default Draft;
