import { useState } from "react";
import { Provider } from "react-redux";
import "./assets/default/default.css";
import Main from "./controller/Main/Main";
import Draft from "./controller/Draft/Draft";
import { combineReducers, createStore } from "redux";
import { Routes, Route, useLocation } from "react-router";

function App() {
  const [loginUser, setLoginUser] = useState({ name: "kevin", age: 28 });
  const { search } = useLocation();

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
        <Route exact path="/" element={<Main />} />
        <Route exact path="/draft/:seq/:id" element={<Draft />} />
      </Routes>
    </Provider>
  );
}

export default App;
