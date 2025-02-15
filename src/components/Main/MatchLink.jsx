import React from "react";

import { FcOpenedFolder } from "react-icons/fc";
import { toast } from "react-toastify";

import { baseUrl } from "../../helper/port";

const MatchLink = React.memo(
  ({ draft: { seq, blueEnName, redEnName, watchEnName } }) => {
    const teamInputRef = React.useRef([]);

    const handleCopy = (type) => {
      const el = teamInputRef.current[type];
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        document.execCommand("copy");
        toast.success("복사가 완료되었습니다", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          hideProgressBar: true,
        });
      } catch (err) {
        toast.error("복사에 실패했습니다", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          hideProgressBar: true,
        });
      }

      selection.removeAllRanges(); // Clear the selection
    };

    return (
      <div className="create">
        <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
        <div className="link_box" onClick={handleCopy.bind(this, "blue")}>
          <label htmlFor="blue_team_name">Blue Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <a
          id="blue_team_name"
          ref={(elem) => (teamInputRef.current["blue"] = elem)}
          href={`${baseUrl}/draft/${seq}/${blueEnName}`}
          target="_blank"
          rel="noreferrer"
        >
          {`${encodeURIComponent(baseUrl)}/draft/${seq}/${blueEnName}`}
        </a>
        <div className="link_box" onClick={handleCopy.bind(this, "red")}>
          <label htmlFor="red_team_name">Red Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <a
          id="red_team_name"
          ref={(elem) => (teamInputRef.current["red"] = elem)}
          href={`${baseUrl}/draft/${seq}/${redEnName}`}
          target="_blank"
          rel="noreferrer"
        >
          {`${encodeURIComponent(baseUrl)}/draft/${seq}/${redEnName}`}
        </a>
        <div className="link_box" onClick={handleCopy.bind(this, "watch")}>
          <label htmlFor="red_team_name">Watch Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <a
          id="watch_team_name"
          ref={(elem) => (teamInputRef.current["watch"] = elem)}
          href={`${baseUrl}/draft/${seq}/${watchEnName}`}
          target="_blank"
          rel="noreferrer"
        >
          {`${encodeURIComponent(baseUrl)}/draft/${seq}/${watchEnName}`}
        </a>
      </div>
    );
  }
);

export default MatchLink;
