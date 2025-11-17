import { configureStore } from "@reduxjs/toolkit";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { localStorageMiddleware, loadState } from "./middleware/localStorage";

// Load persisted state from localStorage
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
