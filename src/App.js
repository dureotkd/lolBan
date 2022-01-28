import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router";
import "./assets/default/default.css";

import Main from "./controller/Main/Main";
import Draft from "./controller/Draft/Draft";

function App() {
  const [loginUser, setLoginUser] = useState({ name: "성민", age: 28 });
  const { search } = useLocation();

  console.log(search.startsWith("?draft="));

  const loginUserReducer = (state = loginUser, action) => {
    const param = action.payload;

    switch (action.type) {
      case "doLogin":
        const loginUser = param.data;

        return loginUser;

      default:
        return state;
    }
  };

  const store = createStore(
    combineReducers({
      loginUserReducer,
    })
  );

  return (
    <Provider store={store}>
      <Routes>
        {search.startsWith("?draft=") ? (
          <Route exact path="/" element={<Draft />} />
        ) : (
          <Route exact path="/" element={<Main />} />
        )}
        {/* // <Route exact path="/draft/:seq/:id" element={<Draft />} /> */}
      </Routes>
    </Provider>
  );
}

export default App;
