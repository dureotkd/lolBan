import React from "react";

import { debounce } from "debounce";
import { empty } from "../../helper/default";
import game from "../../constants/game";

const ChampionList = React.memo(
  ({
    champAll,
    activeCard,
    startGame,
    selectDisabled,
    handlePick,
    handleSearchLine,
    handleSelectPick,
    handleSearchName,
    searchName,
    searchLine,
    activeTeamColor,
  }) => {
    return (
      <div className="contents">
        <div className="search-box">
          <div className="line-box">
            {game.line.map((line, idx) => {
              return (
                <div
                  key={line.key}
                  className={`line-wrap ${
                    searchLine === line.key ? "active-line" : ""
                  }`}
                >
                  <img
                    key={idx}
                    onClick={handleSearchLine.bind(this, line.key)}
                    className={`line-icon`}
                    src={line.img}
                    alt={line.alt}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="confirm"
              disabled={selectDisabled ? true : false}
              onClick={handleSelectPick.bind(this)}
            >
              SELECT
            </button>
            <input
              type="text"
              style={{ marginLeft: 10 }}
              placeholder="search"
              onChange={debounce(handleSearchName, 200)}
            />
          </div>
        </div>
        <div className="champion-box">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {champAll
              .filter((val) => {
                // 챔피언명 검색이 없을시
                if (empty(searchName)) {
                  return val;
                }
                // 챔피언명 검색시 (startsWith 앞글자 동일여부로  true : false 여부 반환)
                else if (val.korName.startsWith(searchName)) {
                  return val;
                }
              })
              .map(({ line, engName, korName }, key) => {
                // 라인검색
                if (!empty(searchLine) && searchLine !== line) return true;

                const imgClassName =
                  activeCard.includes(engName) || !startGame
                    ? "hidden-img"
                    : "";

                const activeTeamColorClassName =
                  imgClassName === "hidden-img"
                    ? ""
                    : `champion-wrap active-team-${activeTeamColor}`;

                return (
                  <div
                    className="champion"
                    key={`${engName}-${key}`}
                    onClick={handlePick.bind(this, { engName })}
                  >
                    <div className={activeTeamColorClassName}>
                      <img
                        className={`champion-icon ${imgClassName}`}
                        alt="롤 챔피언 아이콘"
                        src={
                          `https://opgg-static.akamaized.net/meta/images/lol/14.13.1/champion/${engName}.png`
                          // cKey < 1000
                          //   ? `https://opgg-static.akamaized.net/meta/images/lol/14.13.1/champion/${engName}.png`
                          //   : process.env.PUBLIC_URL + `/champ/${engName}.png`
                        }
                      />
                    </div>
                    <div style={{ marginBottom: 20, marginTop: 3 }}>
                      <p
                        style={{
                          color: "white",
                          opacity: activeCard.includes(engName) ? "0.4" : null,
                        }}
                      >
                        {korName}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
);

export default ChampionList;
