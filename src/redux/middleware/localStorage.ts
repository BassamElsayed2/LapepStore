/**
 * Redux Middleware for localStorage persistence
 * Saves cart and wishlist to localStorage on every update
 */

import { Middleware } from '@reduxjs/toolkit';

// Keys for localStorage
const CART_STORAGE_KEY = 'lapip_cart';
const WISHLIST_STORAGE_KEY = 'lapip_wishlist';

/**
 * Load initial state from localStorage
 */
export const loadState = () => {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    const wishlistData = localStorage.getItem(WISHLIST_STORAGE_KEY);

    return {
      cartReducer: cartData ? JSON.parse(cartData) : { items: [] },
      wishlistReducer: wishlistData ? JSON.parse(wishlistData) : { items: [] },
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return undefined;
  }
};

/**
 * Save state to localStorage
 */
const saveState = (key: string, state: any) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

/**
 * Middleware to persist cart and wishlist
 */
export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Get the updated state
  const state = store.getState();

  // Type assertion for action
  const typedAction = action as { type?: string };

  // Save cart if cart actions are dispatched
  if (typedAction.type?.startsWith('cart/')) {
    saveState(CART_STORAGE_KEY, state.cartReducer);
  }

  // Save wishlist if wishlist actions are dispatched
  if (typedAction.type?.startsWith('wishlist/')) {
    saveState(WISHLIST_STORAGE_KEY, state.wishlistReducer);
  }

  return result;
};

/**
 * Clear localStorage (useful for logout)
 */
export const clearPersistedState = () => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing persisted state:', error);
  }
};

