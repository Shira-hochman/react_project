// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  user: {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  } | null;
}

const initialState: CartState = {
  items: [],
  user: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setUser(state, action: PayloadAction<CartState["user"]>) {
      state.user = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, setUser } = cartSlice.actions;
export default cartSlice.reducer;
