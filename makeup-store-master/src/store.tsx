// store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./pages/cartSlice"; // ודאי שיש לך קובץ כזה

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
