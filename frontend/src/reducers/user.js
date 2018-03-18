const initialState = {
  id: null,
  token: null,
  time: null,
  email: null,
  fullname: null,
  role: null,
  username: null
};

export default function detail(state = initialState, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return action.payload;
    case "USER_UPDATE_DATA":
      console.log("reducer user", {
        ...state,
        id: action.id,
        email: action.email,
        fullname: action.fullname,
        role: action.role,
        username: action.username
      });
      return {
        ...state,
        id: action.id,
        email: action.email,
        fullname: action.fullname,
        role: action.role,
        username: action.username
      };
    case "USER_LOGOUT":
      return initialState;
    default:
      return state;
  }
}
