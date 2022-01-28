import { debounce } from "lodash";
import "../../assets/draft/draft.css";
import { FcManager } from "react-icons/fc";
import { empty } from "../../helper/default";
import { OpacityImage } from "../../component";
import { ad, jg, mid, sup, top } from "../../assets";

function PickCard(props) {
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {props.blueCard &&
          Object.values(props.blueCard).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="pick-image blue-team-card">
                  <span className={value.active}></span>
                  {!empty(value.img) ? (
                    <OpacityImage duration={100} type="show" src={value.img} />
                  ) : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
      <div className="team-picks">
        {props.redCard &&
          Object.values(props.redCard).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="pick-image red-team-card">
                  <span className={value.active}></span>
                  {!empty(value.img) ? (
                    <OpacityImage duration={100} type="show" src={value.img} />
                  ) : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function BanCard(props) {
  return (
    <div className="pick-card-wrap">
      <div className="team-picks">
        {props.blueCard &&
          Object.values(props.blueCard).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="ben-pick-image blue-team-card">
                  <span className={value.active}></span>
                  {!empty(value.img) ? (
                    <OpacityImage duration={100} type="show" src={value.img} />
                  ) : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
      <div className="team-picks">
        {props.blueCard &&
          Object.values(props.redCard).map((value, key) => {
            return (
              <div className="pick" key={value.tmpKey}>
                <div className="ben-pick-image red-team-card">
                  <span className={value.active}></span>
                  {!empty(value.img) ? (
                    <OpacityImage duration={100} type="show" src={value.img} />
                  ) : null}
                </div>
                <span className="pick-name"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function DraftView(props) {
  const searchLineVo = [
    {
      img: top,
      key: "top",
      alt: " 탑 이미지",
    },
    {
      img: jg,
      key: "jg",
      alt: " 정글 이미지",
    },
    {
      img: mid,
      key: "mid",
      alt: " 미드 이미지",
    },
    {
      img: ad,
      key: "ad",
      alt: " 원딜 이미지",
    },
    {
      img: sup,
      key: "sup",
      alt: " 서포터 이미지",
    },
  ];

  return (
    <div className="Contents">
      {/* {props.watchTeamCnt === 0 ? null : (
        <div className="watch">
          <FcManager style={{ fontSize: 20, marginRight: 6 }} />{" "}
          <span>{props.watchTeamCnt}</span>
        </div>
      )} */}
      <div className="competion">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="team-wrap">
            <h1 style={{ fontSize: 23, marginLeft: 12 }}>
              {props.draft.blueName}
            </h1>
            <div className="team-img">
              {/* <span id="blue-second">{props.second["blue"]}</span> */}
            </div>
          </div>
          <div className="team-wrap">
            <div className="team-img red-team">
              {/* <span id="red-second">{props.second["red"]}</span> */}
            </div>
            <h1 style={{ fontSize: 23, marginRight: 12 }}>
              {props.draft.redName}
            </h1>
          </div>
        </div>
      </div>
      <div
        style={{
          transition: "all.3s",
        }}
      >
        <PickCard
          blueCard={props.card.blue.pick}
          redCard={props.card.red.pick}
        />
        <BanCard blueCard={props.card.blue.ban} redCard={props.card.red.ban} />
      </div>
      <div className="champion-box">
        <div className="search-box">
          <div className="line-box">
            {searchLineVo.map((line, idx) => {
              return (
                <div
                  key={line.key}
                  className={`line-wrap ${
                    props.searchLine === line.key ? "active-line" : ""
                  }`}
                >
                  <img
                    key={idx}
                    onClick={props.handleSearchLine.bind(this, line.key)}
                    className={`line-icon`}
                    src={line.img}
                    alt={line.alt}
                  />
                </div>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="챔피언 검색"
            onChange={debounce(props.handleSearchName, 200)}
          />
        </div>
        {props.champAll
          .filter((val) => {
            // 챔피언명 검색이 없을시
            if (empty(props.searchName)) {
              return val;
            }
            // 챔피언명 검색시 (startsWith 앞글자 동일여부로  true : false 여부 반환)
            else if (val.korName.startsWith(props.searchName)) {
              return val;
            }
          })
          .map(({ cKey, line, seq, engName, korName }) => {
            // 라인검색
            if (!empty(props.searchLine) && props.searchLine !== line)
              return true;

            return (
              <div
                className="champion"
                key={cKey}
                onClick={props.handlePick.bind(this, { cKey, engName })}
              >
                <img
                  className="champion-icon"
                  alt="롤 챔피언 아이콘"
                  style={{
                    opacity:
                      props.activeCard.includes(engName) || !props.startGame
                        ? "0.4"
                        : null,
                  }}
                  src={
                    cKey < 1000
                      ? `https://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/${engName}.png`
                      : process.env.PUBLIC_URL + `/champ/${engName}.png`
                  }
                />
                <div style={{ marginBottom: 20, marginTop: 3 }}>
                  <p
                    style={{
                      color: "white",
                      opacity: props.activeCard.includes(engName)
                        ? "0.4"
                        : null,
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
  );
}
