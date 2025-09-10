import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Cart selectors with memoization
export const selectCart = (state: RootState) => state.cartReducer;

export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.items
);

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartItemById = createSelector(
  [selectCartItems, (_state: RootState, id: string) => id],
  (items, id) => items.find((item) => String(item.id) === id)
);

// Wishlist selectors with memoization
export const selectWishlist = (state: RootState) => state.wishlistReducer;

export const selectWishlistItems = createSelector(
  [selectWishlist],
  (wishlist) => wishlist.items
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

export const selectIsInWishlist = createSelector(
  [selectWishlistItems, (_state: RootState, id: string) => id],
  (items, id) => items.some((item) => String(item.id) === id)
);

// Quick View selectors
export const selectQuickView = (state: RootState) => state.quickViewReducer;

export const selectQuickViewProduct = createSelector(
  [selectQuickView],
  (quickView) => quickView.value
);

// Note: QuickView modal state is managed by context, not Redux

// Product Details selectors
export const selectProductDetails = (state: RootState) =>
  state.productDetailsReducer;

export const selectCurrentProduct = createSelector(
  [selectProductDetails],
  (details) => details.value
);

// Note: Related products would need to be added to the ProductDetails slice if needed

// Note: Loading state would need to be added to the ProductDetails slice if needed
