import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardAPI } from "@/services/api";

interface DashboardData {
  countUser: number;
  countBook: number;
  countOrder: number;
}

interface DashboardState extends DashboardData {
  loading: boolean;
  error?: string;
}

const initialDashboardState: DashboardState = {
  countUser: 0,
  countBook: 0,
  countOrder: 0,
  loading: false,
  error: undefined,
};

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboardData",
  async (_, thunkAPI) => {
    const res = await getDashboardAPI();
    if (res.success && res.data) {
      const data: DashboardData = {
        countUser: Number(res.data.countUser ?? 0),
        countBook: Number(res.data.countBook ?? 0),
        countOrder: Number(res.data.countOrder ?? 0),
      };
      return data;
    }
    return thunkAPI.rejectWithValue(res.message ?? "Unknown error");
  }
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.countUser = action.payload.countUser;
        state.countBook = action.payload.countBook;
        state.countOrder = action.payload.countOrder;
        state.error = undefined;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Unknown error";
      });
  },
});

export default dashboardSlice.reducer;
