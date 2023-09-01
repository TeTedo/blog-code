import { atom } from "recoil";

export const dataState = atom({
  key: "downloadData",
  default: {
    headers: [
      { label: "First Name", key: "details.firstName" },
      { label: "Last Name", key: "details.lastName" },
      { label: "Job", key: "job" },
    ],
    data: [
      { details: { firstName: "Ahmed", lastName: "Tomi" }, job: "manager" },
      { details: { firstName: "John", lastName: "Jones" }, job: "developer" },
    ],
  },
});
