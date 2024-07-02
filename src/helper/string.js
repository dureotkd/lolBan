import qs from "qs";

import { empty } from "./default";

const stringHelper = {
  /**
   * 쿼리스트링 => 객체로 변환
   * ex) article?id=1&page=2
   * @returns {
   *   id : 1,
   *   page : 2
   * }
   */
  getParams: function () {
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    return query;
  },
  /**
   * 쿼리스트링 그대로 사용 하고 싶을때
   * @returns ?article?id=1&page=2
   */
  getUrlParams: function (isQsMark = true) {
    const params = this.getParams();
    let res = "";

    if (!empty(params)) {
      const entiresParam = Object.entries(params);

      entiresParam.forEach((item, index) => {
        let oper = index === 0 ? "?" : "&";

        if (isQsMark === false && oper.includes("?")) {
          oper = "";
        }

        const [key, value] = item;

        res += `${oper}${key}=${value}`;
      });
    }
    return res;
  },

  /**
   * 폼 데이터 Submit 할 경우 (serializeObject랑 같습니다)
   * @param {event.target} target
   * @returns {
   *  id : 1,   // input name:id , value:1
   *  page : 2  // input name:page , value:2
   * }
   */
  getFormDataToObject: function (target) {
    const formData = new FormData(target);

    const data = [...formData.entries()];
    const searchData = {};

    if (!empty(data)) {
      data.forEach((item) => {
        const [name, value] = item;
        searchData[name] = value;
      });
    }

    return searchData;
  },
  /**
   * 객체를 쿼리스트링으로 변경
   * ex) {id:1,page:2} => ?id=1&page=2
   * @param {object,isUrlCombine:현재 페이지 쿼리스트링도 포함 할 지 여부}
   * @returns ?id=1&page=2
   */
  getObjectToQueryString({ object, isUrlCombine = true }) {
    let res = "";
    let index = 0;

    const originUrlParmas = isUrlCombine ? this.getParams() : {};

    for (let ob in object) {
      delete originUrlParmas[ob];
      originUrlParmas[ob] = object[ob];
    }

    if (!empty(originUrlParmas)) {
      for (let key in originUrlParmas) {
        const oper = index === 0 ? "?" : "&";

        if (originUrlParmas[key] === "") {
          continue;
        }

        const value = originUrlParmas[key];
        const resValue = typeof value === "object" ? value.value : value;

        res += `${oper}${key}=${resValue}`;

        index++;
      }
    }

    return res;
  },
  getObjectKeyToQueryString({ object, key, value }) {
    let keyQs = `${key}=`;
    let valueQs = `${value}=`;

    const entries = Object.entries(object);

    entries.forEach(([dataKey, dataValue], index) => {
      keyQs += `${dataKey},`;
      valueQs += `${dataValue},`;
    });

    const resKeyQs = keyQs.slice(0, -1).replaceAll(" ", "");
    const resValueQs = valueQs.slice(0, -1).replaceAll(" ", "");

    const res = `?${resKeyQs}&${resValueQs}`;

    return res;
  },
  /**
   * 검색 폼 데이터 전송시 현재주소에 queryString 붙이기
   * ex) article?id=1&page=2
   * @param {event} event
   */
  addSearchQs: function (objectParams) {
    const originUrlParmas = this.getParams();

    for (let ob in objectParams) {
      delete originUrlParmas[ob];
      originUrlParmas[ob] = objectParams[ob];
    }

    const queryString = this.getObjectToQueryString({
      object: originUrlParmas,
      isUrlCombine: true,
    });

    let url = `${window.location.origin}${window.location.pathname}${queryString}`;
    window.history.pushState("", "", url);
  },

  removeSearchQsAll: function () {
    const { bbscode } = this.getParams();
    let url = `${window.location.origin}${window.location.pathname}?bbscode=${bbscode}`;
    window.history.pushState("", "", url);
  },

  removeSearchQs: function (arrayParams) {
    const originUrlParmas = this.getParams();

    for (let value of arrayParams) {
      delete originUrlParmas[value];
    }

    const queryString = this.getObjectToQueryString({
      object: originUrlParmas,
    });

    let url = `${window.location.origin}${window.location.pathname}${queryString}`;
    window.history.pushState("", "", url);
  },

  allRemoveSearchQs: function (exceptions) {
    let originUrlParmas = this.getParams();

    if (exceptions) {
      for (let key in originUrlParmas) {
        if (exceptions.includes(key) === false) {
          delete originUrlParmas[key];
        }
      }
    } else {
      originUrlParmas = {};
    }

    const queryString = this.getObjectToQueryString({
      object: originUrlParmas,
    });

    let url = `${window.location.origin}${window.location.pathname}${queryString}`;
    window.history.pushState("", "", url);
  },

  replacePage: function (page = 1) {
    const url = new URL(window.location.href); // 현재 URL을 가져옴
    const params = new URLSearchParams(url.search);

    // page 파라미터가 있으면 삭제
    if (params.has("page")) {
      params.delete("page");
    }

    // 새로운 page 파라미터 추가
    params.set("page", page);

    // 새로운 URL 생성
    url.search = params.toString();

    return url.toString();
  },

  getNowPageName: function () {
    const pathnameArray = window.location.pathname.split("/");
    return pathnameArray[pathnameArray.length - 1];
  },

  removeComma: function (t) {
    let res = 0;
    if (t) {
      res = t.replaceAll(",", "");
      res = res.replaceAll(".", "");
    }

    res = Number(res);

    return res;
  },

  removeCommaAllObj: function (obj) {
    let res = {};

    for (let key in obj) {
      if (
        typeof obj[key] === "string" &&
        !empty(obj[key]) &&
        obj[key].includes(",")
      ) {
        res[key] = this.removeComma(obj[key]);
      } else {
        res[key] = obj[key];
      }
    }

    return res;
  },

  addComma: function (t) {
    if (!t) {
      return t;
    }

    let str = t.toString();
    let res = str.includes(",") ? str.replaceAll(",", "") : str;

    return Number(res).toLocaleString("en").split(".")[0];
  },

  isNumber: function (t) {
    let check = /^[0-9]+$/;
    let res = true;

    if (!check.test(t)) {
      res = false;
    }

    return res;
  },

  onlyNumberDot: function (t) {
    let str = String(t);
    if (str) {
      str = str.replace(/[^-/./0-9]/g, "");
    }
    // let resStr = str.endsWith('.') ? str.slice(0,-1) : str;
    return str;
  },

  /**
   *
   * 특정위치에 있는 문자 Index 기준으로 replace해줌 !
   * @param {Number} index
   * @param {String} str
   * @param {String} replaceStr
   * @returns
   */
  replaceAt: function (index, str, replaceStr) {
    const strArray = str.split("");
    strArray[index] = replaceStr;

    return strArray.join("");
  },

  companyNumSlice: function (num = "") {
    let formatNum = "";

    try {
      if (num.length === 10) {
        formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      } else {
        formatNum = num;
      }
    } catch (e) {
      formatNum = num;
    }

    return formatNum;
  },
};

export default stringHelper;
