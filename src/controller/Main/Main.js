import React from "react";

import axios from "axios";
import MainView from "../../view/Main/MainView";
import { baseServerUrl, baseUrl } from "../../helper/port";
import { useEffect, useCallback, useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { FcOpenedFolder } from "react-icons/fc";

function Main() {
  const [blueName, setBlueName] = useState("");
  const [redName, setRedName] = useState("");
  const [matchName, setMatchName] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [setting, setSetting] = useState(false);
  const [blueEnName, setBlueEnName] = useState("");
  const [redEnName, setRedEnName] = useState("");
  const [watchEnName, setWatchEnName] = useState("");
  const [draftSeq, setDraftSeq] = useState("");
  const teamInputRef = useRef([]);

  const changeInput = useCallback(() => {
    const blueLen = blueName.length;
    const redLen = redName.length;
    const matchLen = matchName.length;
    const totalLenth = blueLen + redLen + matchLen;
    const validProc = [1];

    for (const valid of validProc) {
      if (totalLenth === 0) {
        setSubmitDisabled(true);
        break;
      }

      if (blueLen === 0) {
        setSubmitDisabled(true);
        break;
      }

      if (redLen === 0) {
        setSubmitDisabled(true);
        break;
      }

      if (matchLen === 0) {
        setSubmitDisabled(true);
        break;
      }

      if (redName === blueName) {
        setSubmitDisabled(true);
        break;
      }

      setSubmitDisabled(false);
    }
  }, [blueName, redName, matchName]);

  useEffect(() => {}, []);

  useEffect(() => {
    changeInput();
  }, [changeInput]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    await axios({
      method: "patch",
      url: `${baseServerUrl}/api/games`,
      params: {
        blueName,
        redName,
        matchName,
      },
    })
      .then(({ status, data }) => {
        if (status === 200) {
          setBlueEnName(data.blueEnName);
          setRedEnName(data.redEnName);
          setWatchEnName(data.watchEnName);
          setDraftSeq(data.seq);
          setSetting(true);
        } else if (status === 500) {
          alert("서버 오류");
        }
      })
      .catch((e) => {})
      .then(() => {
        console.log("[Main] handleFormSubmit");
      });
  };

  const handleCopy = (type) => {
    const el = teamInputRef.current[type];
    el.select();
    document.execCommand("copy");
    toast.success("복사가 완료되었습니다", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
      hideProgressBar: true,
    });
  };

  var x = 1;
  var y = 6;
  while (y--) {
    x++;
  }

  console.log(x, y);

  return (
    <>
      {setting ? <MatchLink /> : <MatchNicknameForm />}
      <ToastContainer />
    </>
  );
}

const MatchLink = React.memo((props) => {
  return (
    <div className="create">
      <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
      <div className="link_box">
        <label htmlFor="blue_team_name">Blue Team Link</label>
        <FcOpenedFolder className="copy_icon" />
      </div>
      <input
        type="text"
        id="blue_team_name"
        readOnly
        value={`${baseUrl}/draft/${props.draftSeq}/${props.blueEnName}`}
      />
      <div className="link_box">
        <label htmlFor="red_team_name">Red Team Link</label>
        <FcOpenedFolder className="copy_icon" />
      </div>
      <input
        type="text"
        id="red_team_name"
        readOnly
        value={`${baseUrl}/draft/${props.draftSeq}/${props.redEnName}`}
      />
      <div className="link_box">
        <label htmlFor="red_team_name">Watch Team Link</label>
        <FcOpenedFolder className="copy_icon" />
      </div>
      <input
        type="text"
        id="watch_team_name"
        readOnly
        ref={(elem) => (props.teamInputRef.current["watch"] = elem)}
        value={`${baseUrl}/draft/${props.draftSeq}/${props.watchEnName}`}
      />
    </div>
  );
});

const MatchNicknameForm = React.memo(() => {
  return (
    <form className="create">
      <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
      <div>
        <label htmlFor="blue_team_name">Blue team name</label>
        <input type="text" id="blue_team_name" maxLength="30" />
        <label htmlFor="red_team_name">Red team name</label>
        <input type="text" id="red_team_name" maxLength="30" />
        <label htmlFor="match_name">Match name</label>
        <input type="text" id="match_name" maxLength="30" />
      </div>
      <button type="submit" className="confirm">
        Confirm
      </button>
    </form>
  );
});

export default Main;
