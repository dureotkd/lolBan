import React from "react";

const MatchDisplay = React.memo(
  ({ blueName, redName, blueSecond, redSecond }) => {
    return (
      <div className="contents">
        <div className="competion">
          <div className="flex al-c js-c">
            <div className="team-wrap">
              <h1 className="f-23 ml-12">{blueName}</h1>
              <div className="team-img">
                <span className="second-blue-box">{blueSecond}</span>
              </div>
            </div>
            <div className="team-wrap">
              <div className="team-img red-team">
                <span className="second-red-box">{redSecond}</span>
              </div>
              <h1 className="f-23 mr-12">{redName}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default MatchDisplay;
