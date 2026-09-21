import { configureStore } from "@reduxjs/toolkit";
import cartSlice, { CART_STORAGE_KEY } from "../feature/cartSlice";
import orderSlice, { ORDER_STORAGE_KEY } from "../feature/orderSlice";
import authSlice, { AUTH_STORAGE_KEY } from "../feature/authSlice";

// create store
export const store = configureStore({
    reducer: {
        allCart: cartSlice,
        allOrder: orderSlice,
        allAuth: authSlice,
    }
})

// keep the cart, last order & signed-in user in sync with localStorage on
// every change, so a page refresh never loses them
store.subscribe(() => {
    const state = store.getState();
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.allCart.cart));
        if (state.allOrder.lastOrder) {
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(state.allOrder.lastOrder));
        }
        if (state.allAuth.currentUser) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.allAuth.currentUser));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (err) {
        // localStorage can throw in private-browsing / storage-full situations - ignore
    }
});
