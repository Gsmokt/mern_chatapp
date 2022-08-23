export const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  REMOVE_USER: "REMOVE_USER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      localStorage.setItem("user", JSON.stringify(action.user));
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.REMOVE_USER:
      localStorage.clear();
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
