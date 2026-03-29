import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  stock: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

/** null/undefined stock = no numeric cap in cart (unlimited for UI math) */
function effectiveStockCap(stock: number | null | undefined): number {
  if (typeof stock === "number" && !Number.isNaN(stock) && stock >= 0) {
    return stock;
  }
  return Number.MAX_SAFE_INTEGER;
}

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, stock, imgs } =
        action.payload;
      const cap = effectiveStockCap(stock);
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const existingCap = effectiveStockCap(existingItem.stock);
        const limit = Math.min(cap, existingCap);
        if (existingItem.quantity + quantity <= limit) {
          existingItem.quantity += quantity;
        }
      } else {
        if (quantity <= cap) {
          const storedStock =
            typeof stock === "number" && !Number.isNaN(stock) && stock >= 0
              ? stock
              : Number.MAX_SAFE_INTEGER;
          state.items.push({
            id,
            title,
            price,
            quantity,
            discountedPrice,
            stock: storedStock,
            imgs,
          });
        }
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const limit = effectiveStockCap(existingItem.stock);
        const next = Math.min(Math.max(1, quantity), limit);
        existingItem.quantity = next;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
