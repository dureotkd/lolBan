import React from "react";
import Main from "../controller/Main/Main";
import Draft from "../controller/Draft/Draft";

const pages = [
  {
    url: "/",
    label: "메인",
    element: <Main />,
  },
  {
    url: "/draft/:seq/:id",
    label: "게임[상세]",
    element: <Draft />,
  },
];

export { pages };
