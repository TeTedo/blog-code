import { atom } from "recoil";

export const countState = atom({
  key: "countState",
  default: { value: 0 },
});
