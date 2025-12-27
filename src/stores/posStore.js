import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePosStore = create()(persist((set, get) => ({
    // Cart State
    cart: [],
    customer: null,
    invoiceDiscount: 0, // Invoice-level discount
    invoiceDiscountType: 'percentage', // 'percentage' or 'fixed'
    notes: '',

    // Session State
    currentSession: null,

    // Cart Actions
    addToCart: (service) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === service.id);

        if (existingItem) {
            set({
                cart: cart.map(item =>
                    item.id === service.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            set({
                cart: [...cart, {
                    ...service,
                    quantity: 1,
                    itemDiscount: 0,
                    itemDiscountType: 'percentage',
                }]
            });
        }
    },

    removeFromCart: (serviceId) => {
        set({
            cart: get().cart.filter(item => item.id !== serviceId)
        });
    },

    updateQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(serviceId);
            return;
        }

        set({
            cart: get().cart.map(item =>
                item.id === serviceId
                    ? { ...item, quantity }
                    : item
            )
        });
    },

    updateItemDiscount: (serviceId, discount, discountType = 'percentage') => {
        set({
            cart: get().cart.map(item =>
                item.id === serviceId
                    ? { ...item, itemDiscount: discount, itemDiscountType: discountType }
                    : item
            )
        });
    },

    setInvoiceDiscount: (discount, discountType = 'percentage') => {
        set({ invoiceDiscount: discount, invoiceDiscountType: discountType });
    },

    setCustomer: (customer) => set({ customer }),

    setNotes: (notes) => set({ notes }),

    clearCart: () => set({
        cart: [],
        customer: null,
        invoiceDiscount: 0,
        invoiceDiscountType: 'percentage',
        notes: '',
    }),

    // Calculation Methods
    getCartTotals: () => {
        const { cart, invoiceDiscount, invoiceDiscountType } = get();

        // Calculate item totals with item-level discounts
        const itemsWithTotals = cart.map(item => {
            const baseAmount = item.price * item.quantity;
            let itemDiscountAmount = 0;

            if (item.itemDiscount > 0) {
                itemDiscountAmount = item.itemDiscountType === 'percentage'
                    ? (baseAmount * item.itemDiscount) / 100
                    : item.itemDiscount;
            }

            const amountAfterItemDiscount = baseAmount - itemDiscountAmount;
            const taxAmount = (amountAfterItemDiscount * item.taxRate) / 100;

            return {
                ...item,
                baseAmount,
                itemDiscountAmount,
                amountAfterItemDiscount,
                taxAmount,
                total: amountAfterItemDiscount + taxAmount,
            };
        });

        // Calculate subtotal (before invoice discount)
        const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.amountAfterItemDiscount, 0);

        // Calculate invoice-level discount
        let invoiceDiscountAmount = 0;
        if (invoiceDiscount > 0) {
            invoiceDiscountAmount = invoiceDiscountType === 'percentage'
                ? (subtotal * invoiceDiscount) / 100
                : invoiceDiscount;
        }

        // Amount after all discounts
        const amountAfterDiscount = subtotal - invoiceDiscountAmount;

        // Calculate tax on discounted amount
        const taxTotal = itemsWithTotals.reduce((sum, item) => {
            const itemRatio = item.amountAfterItemDiscount / subtotal;
            const itemAfterInvoiceDiscount = amountAfterDiscount * itemRatio;
            return sum + (itemAfterInvoiceDiscount * item.taxRate) / 100;
        }, 0);

        // Total item discounts
        const itemDiscountTotal = itemsWithTotals.reduce((sum, item) => sum + item.itemDiscountAmount, 0);

        // Grand total
        const total = amountAfterDiscount + taxTotal;

        return {
            itemsWithTotals,
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemDiscountTotal,
            subtotalAfterItemDiscount: subtotal,
            invoiceDiscountAmount,
            amountAfterDiscount,
            taxTotal,
            total,
        };
    },

    // Session Management
    openSession: (session) => set({ currentSession: session }),

    closeSession: () => set({ currentSession: null }),

}), {
    name: 'pos-store',
    partialize: (state) => ({
        cart: state.cart,
        customer: state.customer,
        invoiceDiscount: state.invoiceDiscount,
        invoiceDiscountType: state.invoiceDiscountType,
        notes: state.notes,
    }),
}));
