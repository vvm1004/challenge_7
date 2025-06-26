// src/redux/user/userSlice.ts

import { createUserAPI, deleteUserAPI, getUserByIdAPI, getUsersAPI, updateUserAPI } from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


interface UserState {
  listUsers: IUserTable[];
  total: number;
  selectedUser?: IUserTable;
  isCreateSuccess: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  loading: boolean;
  error?: string;
}

const initialState: UserState = {
  listUsers: [],
  total: 0,
  loading: false,
  isCreateSuccess: false,
  isUpdateSuccess: false,
  isDeleteSuccess: false,
  error: undefined,
};

// Async thunks
export const fetchListUsers = createAsyncThunk(
  "users/fetchListUsers",
  async (params: Record<string, any>, thunkAPI) => {
    try {
      const res = await getUsersAPI(params);
      return res; // { result: [...], total: number }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createNewUser = createAsyncThunk(
  "users/createNewUser",
  async (data: IUserTable, thunkAPI) => {
    const res = await createUserAPI(data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: number; data: Partial<IUserTable> }, thunkAPI) => {
    const res = await updateUserAPI(id, data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, thunkAPI) => {
    const res = await deleteUserAPI(id);
    if (res.success) {
      return id;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: number, thunkAPI) => {
    try {
      const res = await getUserByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetCreate: (state) => {
      state.isCreateSuccess = false;
    },
    resetUpdate: (state) => {
      state.isUpdateSuccess = false;
    },
    resetDelete: (state) => {
      state.isDeleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers = action.payload.result;
        state.total = action.payload.total;
      })
      .addCase(fetchListUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createNewUser.fulfilled, (state) => {
        state.isCreateSuccess = true;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateUser.fulfilled, (state) => {
        state.isUpdateSuccess = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteUser.fulfilled, (state) => {
        state.isDeleteSuccess = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = userSlice.actions;

export default userSlice.reducer;
