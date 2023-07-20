import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export default function config() {
  const store = configureStore({
    reducer: rootReducer,
    devTools: composeWithDevTools(),
  });

  return store;
}
