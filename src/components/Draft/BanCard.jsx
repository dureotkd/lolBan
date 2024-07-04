import React from "react";

import { OpacityImage } from "../../components/Draft";

const BanCard = React.memo(({ blue, red }) => {
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {blue &&
          Object.values(blue).map(({ tmpKey, active, img }, key) => {
            return (
              <div className="pick" key={`blue-ban-${key}`}>
                <div className="ben-pick-image blue-team-card">
                  <span className={active}></span>
                  {img ? <OpacityImage duration={100} src={img} /> : null}
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
              <div className="pick" key={`red-ban-${key}`}>
                <div className="ben-pick-image red-team-card">
                  <span className={active}></span>
                  {img ? <OpacityImage duration={100} src={img} /> : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default BanCard;
