import React from "react";

export const ReactMemoDetail = React.memo(({ id, name, age }) => {
  console.log("ReactMemoDetail rendering id : ", id);
  return (
    <div>
      <span>{id}</span>
      <span>{name}</span>
      <span>{age}</span>
    </div>
  );
});
