import { createSlice } from "@reduxjs/toolkit";

const ORDER_STORAGE_KEY = "our_meal_last_order";

const loadOrderFromStorage = () => {
    try {
        const saved = localStorage.getItem(ORDER_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (err) {
        return null;
    }
};

const initialState = {
    lastOrder: loadOrderFromStorage(),
};

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {
        // called on checkout submit - stores the delivery/payment details,
        // the items ordered, and starts the order at the first tracking stage
        placeOrder: (state, action) => {
            state.lastOrder = {
                ...action.payload,
                status: 0, // 0 received -> 1 preparing -> 2 on the way -> 3 delivered
                placedAt: Date.now(),
            };
        },
        // advances the tracking stepper (used by the tracking page's simulated timers)
        advanceOrderStatus: (state) => {
            if (state.lastOrder && state.lastOrder.status < 3) {
                state.lastOrder.status += 1;
            }
        },
    }
});

export const { placeOrder, advanceOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
export { ORDER_STORAGE_KEY };
