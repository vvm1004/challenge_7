// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import bookReducer from "./book/bookSlice";
import orderReducer from "./order/orderSlice";
import dashboardReducer from "./dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
