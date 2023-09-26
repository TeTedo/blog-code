import React from "react";
import { useNavigate } from "react-router";

export const Home = () => {
  const nav = useNavigate();
  const handleMovePage = (to) => {
    nav(to);
  };
  return (
    <div>
      <button onClick={() => handleMovePage("react-memo")}>React.memo</button>
      <button onClick={() => handleMovePage("useMemo")}>useMemo</button>
      <button onClick={() => handleMovePage("useCallback")}>useCallback</button>
    </div>
  );
};
