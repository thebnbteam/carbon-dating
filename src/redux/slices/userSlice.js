import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  loginState: "",
  loginInfo: "",
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = UserSlice.actions;

export default UserSlice.reducer;
