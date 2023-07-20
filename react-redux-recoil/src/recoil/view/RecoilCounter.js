import React from "react";
import { countState } from "../atom/countState";
import { useRecoilState } from "recoil";

export const RecoilCounter = () => {
  const [counter, setCounter] = useRecoilState(countState);
  const clickHandler = () => {
    setCounter({
      value: counter.value + 1,
    });
  };

  return (
    <div>
      Value : {counter.value}
      <button onClick={clickHandler}>increment Btn</button>
    </div>
  );
};
