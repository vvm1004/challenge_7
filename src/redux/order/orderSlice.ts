import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBookByIdAPI, getOrdersAPI, getUserByIdAPI, updateOrderAPI } from "@/services/api";

interface OrderState {
    listOrders: IOrderWithUser[];
    total: number;
    loading: boolean;
    isUpdateSuccess: boolean;
    error?: string;
}

const initialOrderState: OrderState = {
    listOrders: [],
    total: 0,
    loading: false,
    isUpdateSuccess: false,
    error: undefined,
};


export const fetchListOrders = createAsyncThunk<
    { result: IOrderWithUser[]; total: number },    
    Record<string, any>,                            
    { rejectValue: string }                         
>("orders/fetchListOrders", async (params, thunkAPI) => {
    try {
        const res = await getOrdersAPI(params); // { result, total }

        if (!res?.result) {
            return thunkAPI.rejectWithValue("No data found");
        }

        const ordersRaw: IOrder[] = res.result;

        const enrichedOrders: IOrderWithUser[] = await Promise.all(
            ordersRaw.map(async (order) => {
                let userFullName = "Unknown";
                try {
                    const userRes = await getUserByIdAPI(order.userId);
                    userFullName = userRes?.data?.name || "Unknown";
                } catch { }

                let totalPrice = 0;
                try {
                    const bookResults = await Promise.all(
                        order.productIds.map((bookId) => getBookByIdAPI(bookId))
                    );
                    totalPrice = bookResults.reduce(
                        (sum, book) => sum + (book.data?.price || 0),
                        0
                    );
                } catch (e) {
                    console.error("Error fetching book info", e);
                }

                return {
                    ...order,
                    userFullName,
                    totalPrice,
                };
            })
        );

        return { result: enrichedOrders, total: res.total || 0 };
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message || "Something went wrong");
    }
});

export const updateOrder = createAsyncThunk(
    "orders/updateOrder",
    async ({ id, data }: { id: number; data: Partial<IOrderWithUser> }, thunkAPI) => {
        const res = await updateOrderAPI(id, data);
        if (res.success) return res.data;
        return thunkAPI.rejectWithValue(res.message);
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: initialOrderState,
    reducers: {
        resetUpdate: (state) => {
            state.isUpdateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.listOrders = action.payload.result;
                state.total = action.payload.total;
            })
            .addCase(fetchListOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateOrder.fulfilled, (state) => {
                state.isUpdateSuccess = true;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { resetUpdate: resetOrderUpdate } = orderSlice.actions;
export default orderSlice.reducer; 