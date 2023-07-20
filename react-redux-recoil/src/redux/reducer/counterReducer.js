const initState = { value: 0 };

export const counterReducer = (state = initState, action) => {
  if (action.type === "counter/increment") {
    return {
      ...state,
      value: state.value + 1,
    };
  }

  return state;
};

export const selectCounterValue = (state) => state.counter.value;
