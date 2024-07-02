import React from "react";

import { FcOpenedFolder } from "react-icons/fc";
import { toast } from "react-toastify";

import { baseUrl } from "../../helper/port";

const MatchLink = React.memo(
  ({ draft: { seq, blueEnName, redEnName, watchEnName } }) => {
    const teamInputRef = React.useRef([]);

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

    return (
      <div className="create">
        <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
        <div className="link_box" onClick={handleCopy.bind(this, "blue")}>
          <label htmlFor="blue_team_name">Blue Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <input
          type="text"
          id="blue_team_name"
          readOnly
          ref={(elem) => (teamInputRef.current["blue"] = elem)}
          value={`${baseUrl}/draft/${seq}/${blueEnName}`}
        />
        <div className="link_box" onClick={handleCopy.bind(this, "red")}>
          <label htmlFor="red_team_name">Red Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <input
          type="text"
          id="red_team_name"
          readOnly
          ref={(elem) => (teamInputRef.current["red"] = elem)}
          value={`${baseUrl}/draft/${seq}/${redEnName}`}
        />
        <div className="link_box" onClick={handleCopy.bind(this, "watch")}>
          <label htmlFor="red_team_name">Watch Team Link</label>
          <FcOpenedFolder className="copy_icon" />
        </div>
        <input
          type="text"
          id="watch_team_name"
          readOnly
          ref={(elem) => (teamInputRef.current["watch"] = elem)}
          value={`${baseUrl}/draft/${seq}/${watchEnName}`}
        />
      </div>
    );
  }
);

export default MatchLink;
