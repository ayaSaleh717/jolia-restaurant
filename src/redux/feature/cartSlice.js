import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "our_meal_cart";

// read any previously saved cart so a page refresh doesn't wipe it out
const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        return [];
    }
};

const initialState = {
    cart: loadCartFromStorage(),
    promo: null,
};

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    reducers: {
        // each cart line is keyed by a composite id (dish id + size + extras)
        // so the same dish with different customizations stacks separately
        addToCart: (state, action) => {

            const IteamIndex = state.cart.findIndex((iteam) => iteam.id === action.payload.id);

            if (IteamIndex >= 0) {
                state.cart[IteamIndex].qnty += 1
            } else {
                const temp = { ...action.payload, qnty: 1 }
                state.cart = [...state.cart, temp]

            }
        },
        // remove perticular iteams
        removeToCart: (state, action) => {
            const data = state.cart.filter((ele) => ele.id !== action.payload);
            state.cart = data;
        },

        // remove single iteams
        removeSingleIteams: (state, action) => {
            const IteamIndex_dec = state.cart.findIndex((iteam) => iteam.id === action.payload.id);

            if (state.cart[IteamIndex_dec].qnty >= 1) {
                state.cart[IteamIndex_dec].qnty -= 1
            }

        },

        // clear cart
        emptycartIteam: (state) => {
            state.cart = []
        },

        // apply / clear a promo code discount percentage
        applyPromo: (state, action) => {
            state.promo = action.payload;
        },
        clearPromo: (state) => {
            state.promo = null;
        }

    }

});

export const { addToCart, removeToCart, removeSingleIteams, emptycartIteam, applyPromo, clearPromo } = cartSlice.actions;

export default cartSlice.reducer;
export { CART_STORAGE_KEY };
