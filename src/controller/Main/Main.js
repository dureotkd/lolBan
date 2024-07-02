import React from "react";

import axios from "axios";
import { baseServerUrl, baseUrl } from "../../helper/port";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import stringHelper from "../../helper/string";
import { empty } from "../../helper/default";

import { MatchLink, MatchForm } from "../../components/Main";

function Main() {
  const [draft, setDraft] = React.useState({});

  const handleFormSubmit = React.useCallback(async (event) => {
    event.preventDefault();

    const formObject = stringHelper.getFormDataToObject(event.target);

    let isAjax = true;

    for (let a in formObject) {
      if (formObject[a] === "") {
        alert(`Please Input ${a}`);
        document.querySelector(`#${a}`).focus();
        isAjax = false;
        break;
      }
    }

    if (!isAjax) {
      return;
    }

    await axios({
      method: "patch",
      url: `${baseServerUrl}/api/games`,
      params: {
        blueName: formObject.blue_team_name,
        redName: formObject.red_team_name,
        matchName: formObject.match_name,
      },
    }).then(({ status, data: { blueEnName, redEnName, watchEnName, seq } }) => {
      if (status === 200) {
        setDraft((prev) => {
          return {
            ...prev,
            blueEnName: blueEnName,
            redEnName: redEnName,
            watchEnName: watchEnName,
            seq: seq,
          };
        });
      } else if (status === 500) {
        alert("서버 오류");
      }
    });
  }, []);

  return (
    <>
      {!empty(draft) ? (
        <MatchLink draft={draft} />
      ) : (
        <MatchForm handleFormSubmit={handleFormSubmit} />
      )}
      <ToastContainer />
    </>
  );
}

export default Main;
