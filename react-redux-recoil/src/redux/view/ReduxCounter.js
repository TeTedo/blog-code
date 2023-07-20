import React from "react";
import { store } from "..";
import { useSelector } from "react-redux";
import { selectCounterValue } from "../reducer/counterReducer";

export const ReduxCounter = () => {
  const increment = () => {
    return {
      type: "counter/increment",
    };
  };

  const clickHandler = () => {
    store.dispatch(increment());
  };

  // counter state가 바뀌면 리렌더링
  const counter = useSelector(selectCounterValue);

  return (
    <div>
      Value : {counter}
      <button onClick={clickHandler}>increment Btn</button>
    </div>
  );
};
