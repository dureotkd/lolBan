import axios from "axios";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import MainView from "../../view/Main/MainView";
import { useEffect, useCallback, useState, useRef } from "react";

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
  const firstInputRef = useRef();

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

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    changeInput();
  }, [changeInput]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    await axios({
      method: "patch",
      url: "http://localhost:8080/api/games",
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

  return (
    <MainView
      setBlueName={setBlueName}
      setRedName={setRedName}
      setMatchName={setMatchName}
      submitDisabled={submitDisabled}
      handleFormSubmit={handleFormSubmit}
      firstInputRef={firstInputRef}
      setting={setting}
      blueEnName={blueEnName}
      redEnName={redEnName}
      watchEnName={watchEnName}
      draftSeq={draftSeq}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Main);
