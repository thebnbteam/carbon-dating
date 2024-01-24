import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userUid: {},
  loginState: "",
  loginInfo: "",
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserUid: (state, action) => {
      state.userUid = action.payload;
    },
  },
});

export const { setUserUid } = UserSlice.actions;

export default UserSlice.reducer;
