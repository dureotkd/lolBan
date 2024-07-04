import React from "react";
import OpacityImage from "./OpacityImage";

const PickCard = React.memo(({ blue, red }) => {
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {blue &&
          Object.values(blue).map(({ active, img }, key) => {
            return (
              <div className="pick" key={`blue-pick-${key}`}>
                <div className="pick-image blue-team-card">
                  <span className={active}></span>
                  {img ? (
                    <OpacityImage duration={100} type="show" src={img} />
                  ) : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
      <div className="team-picks">
        {red &&
          Object.values(red).map(({ tmpKey, active, img }, key) => {
            return (
              <div className="pick" key={`red-pick-${key}`}>
                <div className="pick-image red-team-card aa">
                  <span className={active}></span>
                  {img ? (
                    <OpacityImage duration={100} type="show" src={img} />
                  ) : null}
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
