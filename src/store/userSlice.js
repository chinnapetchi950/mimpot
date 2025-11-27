// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,       // store user object
  token: null       // optional: store token if backend returns it
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
