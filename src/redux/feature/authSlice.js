import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "joulia_auth_user";
const USERS_STORAGE_KEY = "joulia_registered_users";

const loadCurrentUser = () => {
    try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (err) {
        return null;
    }
};

const initialState = {
    currentUser: loadCurrentUser(),
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
export { AUTH_STORAGE_KEY, USERS_STORAGE_KEY };
