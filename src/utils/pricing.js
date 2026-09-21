export const DELIVERY_FEE = 25;
export const FREE_DELIVERY_THRESHOLD = 300;

export const PROMO_CODES = {
    SAVE10: 10,
    WELCOME15: 15,
};

// returns { subtotal, deliveryFee, discount, total, quantity } for a cart + promo
export function computeTotals(cart, promo) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qnty, 0);
    const quantity = cart.reduce((sum, item) => sum + item.qnty, 0);
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
    const total = Math.max(subtotal + deliveryFee - discount, 0);

    return { subtotal, quantity, deliveryFee, discount, total };
}
