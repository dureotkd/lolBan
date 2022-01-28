/*
value값이 비어있는지 확인합니다 
true,false
*/
const empty = function (value) {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    value === 0 ||
    (value != null && typeof value == "object" && !Object.keys(value).length)
  ) {
    return true;
  } else {
    return false;
  }
};

const isActive = ({ turn, key, action, team }) => {
  const turnTeam = turn % 2 === 0 ? "blue" : "red";
  const turnAction = turn < 10 ? "ban" : "pick";
  const turnkey = turn < 5 ? turn : turn % 5;
  let active = false;

  if (turnkey === key && turnTeam === team && action === turnAction) {
    active = true;
  }

  console.log(turn);

  return active;
};

const getImageConvertParam = (src) => {
  return `https://img1.daumcdn.net/thumb/C120x120.fjpg/?fname=${src}`;
};

/*
알림창을 생성합니다
*/
// const createNotification = ({ type, msg, time }) => {
//   switch (type) {
//     default:
//       break;
//     case "info":
//       NotificationManager.info(msg, "aaa", time);
//       break;
//     case "success":
//       NotificationManager.success("Success message", "Title here");
//       break;
//     case "warning":
//       NotificationManager.warning(
//         "Warning message",
//         "Close after 3000ms",
//         3000
//       );
//       break;
//     case "error":
//       NotificationManager.error("Error message", msg, time);
//       break;
//   }
// };

//  async await setTimeout
const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

// Riot API에서 제공하는 lol 챔피언 id를 한글 이름으로 반환하고
//없는 값을 입력하면 -1을 반환하는 method
const champKorName = ($id) => {
  // 매개변수: 챔피언 id
  let $a = "";
  switch ($id) {
    case 266:
      $a = "아트록스";
      break; // 챔피언 한글 이름
    case 412:
      $a = "쓰레쉬";
      break;
    case 23:
      $a = "트린다미어";
      break;
    case 79:
      $a = "그라가스";
      break;
    case 69:
      $a = "카시오페아";
      break;
    case 136:
      $a = "아우렐리온 솔";
      break;
    case 13:
      $a = "라이즈";
      break;
    case 78:
      $a = "뽀삐";
      break;
    case 14:
      $a = "사이온";
      break;
    case 1:
      $a = "애니";
      break;
    case 202:
      $a = "진";
      break;
    case 43:
      $a = "카르마";
      break;
    case 111:
      $a = "노틸러스";
      break;
    case 240:
      $a = "클레드";
      break;
    case 99:
      $a = "럭스";
      break;
    case 103:
      $a = "아리";
      break;
    case 2:
      $a = "올라프";
      break;
    case 112:
      $a = "빅토르";
      break;
    case 34:
      $a = "애니비아";
      break;
    case 27:
      $a = "신지드";
      break;
    case 86:
      $a = "가렌";
      break;
    case 127:
      $a = "리산드라";
      break;
    case 57:
      $a = "마오카이";
      break;
    case 25:
      $a = "모르가나";
      break;
    case 28:
      $a = "이블린";
      break;
    case 105:
      $a = "피즈";
      break;
    case 74:
      $a = "하이머딩거";
      break;
    case 238:
      $a = "제드";
      break;
    case 68:
      $a = "럼블";
      break;
    case 82:
      $a = "모데카이저";
      break;
    case 37:
      $a = "소나";
      break;
    case 96:
      $a = "코그모";
      break;
    case 55:
      $a = "카타리나";
      break;
    case 117:
      $a = "룰루";
      break;
    case 22:
      $a = "애쉬";
      break;
    case 30:
      $a = "카서스";
      break;
    case 12:
      $a = "알리스타";
      break;
    case 122:
      $a = "다리우스";
      break;
    case 67:
      $a = "베인";
      break;
    case 110:
      $a = "바루스";
      break;
    case 77:
      $a = "우디르";
      break;
    case 89:
      $a = "레오나";
      break;
    case 126:
      $a = "제이스";
      break;
    case 134:
      $a = "신드라";
      break;
    case 80:
      $a = "판테온";
      break;
    case 92:
      $a = "리븐";
      break;
    case 121:
      $a = "카직스";
      break;
    case 42:
      $a = "코르키";
      break;
    case 268:
      $a = "아지르";
      break;
    case 51:
      $a = "케이틀린";
      break;
    case 76:
      $a = "니달리";
      break;
    case 85:
      $a = "케인";
      break;
    case 3:
      $a = "갈리오";
      break;
    case 45:
      $a = "베이가";
      break;
    case 432:
      $a = "바드";
      break;
    case 150:
      $a = "나르";
      break;
    case 90:
      $a = "말자하";
      break;
    case 104:
      $a = "그레이브즈";
      break;
    case 254:
      $a = "바이";
      break;
    case 10:
      $a = "케일";
      break;
    case 39:
      $a = "이렐리아";
      break;
    case 64:
      $a = "리 신";
      break;
    case 420:
      $a = "일라오이";
      break;
    case 60:
      $a = "엘리스";
      break;
    case 106:
      $a = "볼리베어";
      break;
    case 20:
      $a = "누누";
      break;
    case 4:
      $a = "트위스티드 페이트";
      break;
    case 24:
      $a = "잭스";
      break;
    case 102:
      $a = "쉬바나";
      break;
    case 429:
      $a = "칼리스타";
      break;
    case 36:
      $a = "문도 박사";
      break;
    case 427:
      $a = "아이번";
      break;
    case 131:
      $a = "다이애나";
      break;
    case 63:
      $a = "브랜드";
      break;
    case 113:
      $a = "세주아니";
      break;
    case 8:
      $a = "블라디미르";
      break;
    case 154:
      $a = "자크";
      break;
    case 421:
      $a = "렉사이";
      break;
    case 133:
      $a = "퀸";
      break;
    case 84:
      $a = "아칼리";
      break;
    case 163:
      $a = "탈리아";
      break;
    case 18:
      $a = "트리스타나";
      break;
    case 120:
      $a = "헤카림";
      break;
    case 15:
      $a = "시비르";
      break;
    case 236:
      $a = "루시안";
      break;
    case 107:
      $a = "렝가";
      break;
    case 19:
      $a = "워윅";
      break;
    case 72:
      $a = "스카너";
      break;
    case 54:
      $a = "말파이트";
      break;
    case 157:
      $a = "야스오";
      break;
    case 101:
      $a = "제라스";
      break;
    case 17:
      $a = "티모";
      break;
    case 75:
      $a = "나서스";
      break;
    case 58:
      $a = "레넥톤";
      break;
    case 119:
      $a = "드레이븐";
      break;
    case 35:
      $a = "샤코";
      break;
    case 50:
      $a = "스웨인";
      break;
    case 91:
      $a = "탈론";
      break;
    case 40:
      $a = "잔나";
      break;
    case 115:
      $a = "직스";
      break;
    case 245:
      $a = "에코";
      break;
    case 61:
      $a = "오리아나";
      break;
    case 114:
      $a = "피오라";
      break;
    case 9:
      $a = "피들스틱";
      break;
    case 31:
      $a = "초가스";
      break;
    case 33:
      $a = "람머스";
      break;
    case 7:
      $a = "르블랑";
      break;
    case 16:
      $a = "소라카";
      break;
    case 26:
      $a = "질리언";
      break;
    case 56:
      $a = "녹턴";
      break;
    case 222:
      $a = "징크스";
      break;
    case 83:
      $a = "요릭";
      break;
    case 6:
      $a = "우르곳";
      break;
    case 203:
      $a = "킨드레드";
      break;
    case 21:
      $a = "미스 포츈";
      break;
    case 62:
      $a = "오공";
      break;
    case 53:
      $a = "블리츠크랭크";
      break;
    case 98:
      $a = "쉔";
      break;
    case 201:
      $a = "브라움";
      break;
    case 5:
      $a = "신 짜오";
      break;
    case 29:
      $a = "트위치";
      break;
    case 11:
      $a = "마스터 이";
      break;
    case 44:
      $a = "타릭";
      break;
    case 32:
      $a = "아무무";
      break;
    case 41:
      $a = "갱플랭";
      break;
    case 48:
      $a = "트런들";
      break;
    case 38:
      $a = "카사딘";
      break;
    case 161:
      $a = "벨코즈";
      break;
    case 143:
      $a = "자이라";
      break;
    case 267:
      $a = "나미";
      break;
    case 59:
      $a = "자르반 4세";
      break;
    case 81:
      $a = "이즈리얼";
      break;
    case 350:
      $a = "유미";
      break;
    case 145:
      $a = "카이사";
      break;
    case 518:
      $a = "니코";
      break;
    case 142:
      $a = "조이";
      break;
    case 498:
      $a = "자야";
      break;
    case 517:
      $a = "사일러스";
      break;
    case 141:
      $a = "케인";
      break;
    case 516:
      $a = "오른";
      break;
    case 555:
      $a = "파이크";
      break;
    case 164:
      $a = "카멜";
      break;
    case 246:
      $a = "키아나";
      break;
    case 497:
      $a = "라칸";
      break;
    case 777:
      $a = "요네";
      break;
    case 876:
      $a = "릴리아";
      break;
    case 235:
      $a = "세나";
      break;
    case 875:
      $a = "세트";
      break;
    case 523:
      $a = "아펠리오스";
      break;

    case 223:
      $a = "탐 켄치";
      break;

    case 360:
      $a = "사미라";
      break;

    default:
      $a = -1;
      break;
  }

  return $a;
};

export { empty, wait, champKorName, getImageConvertParam, isActive };
