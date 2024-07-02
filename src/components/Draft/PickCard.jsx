import React from "react";

const PickCard = React.memo(({ blue, red }) => {
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

export default PickCard;
