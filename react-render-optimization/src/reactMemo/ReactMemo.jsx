import React, { useState } from "react";
import userDataJson from "../userData.json";
import { ReactMemoDetail } from "./ReactMemoDetail";

export const ReactMemo = () => {
  const [userData, setUserData] = useState(userDataJson.data);

  const addUser = () => {
    setUserData([...userData, { id: 4, name: "temp", age: 25 }]);
  };

  const changeUser = () => {
    setUserData([{ id: 5, name: "teddy", age: 20 }]);
  };

  return (
    <div>
      <div>ReactMemo Test</div>
      <button onClick={addUser}>유저 추가</button>

      <button onClick={changeUser}>유저 변경</button>

      {userData.map((user, idx) => (
        <ReactMemoDetail
          key={user.name}
          id={user.id}
          name={user.name}
          age={user.age}
        />
      ))}
    </div>
  );
};
