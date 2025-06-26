// src/redux/book/bookSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createBookAPI,
  deleteBookAPI,
  getBooksAPI,
  getBookByIdAPI,
  updateBookAPI,
} from "@/services/api";

interface BookState {
  listBooks: IBookTable[];
  total: number;
  selectedBook?: IBookTable;
  isCreateSuccess: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  loading: boolean;
  error?: string;
}

const initialState: BookState = {
  listBooks: [],
  total: 0,
  loading: false,
  isCreateSuccess: false,
  isUpdateSuccess: false,
  isDeleteSuccess: false,
  error: undefined,
};

// Async thunks
export const fetchListBooks = createAsyncThunk(
  "books/fetchListBooks",
  async (params: Record<string, any>, thunkAPI) => {
    try {
      const res = await getBooksAPI(params);
      return res; // { result: [...], total: number }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createNewBook = createAsyncThunk(
  "books/createNewBook",
  async (data: IBookTable, thunkAPI) => {
    const res = await createBookAPI(data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, data }: { id: number; data: Partial<IBookTable> }, thunkAPI) => {
    const res = await updateBookAPI(id, data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: number, thunkAPI) => {
    const res = await deleteBookAPI(id);
    if (res.success) {
      return id;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id: number, thunkAPI) => {
    try {
      const res = await getBookByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Slice
const bookSlice = createSlice({
  name: "book",
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
      .addCase(fetchListBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.listBooks = action.payload.result;
        state.total = action.payload.total;
      })
      .addCase(fetchListBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createNewBook.fulfilled, (state) => {
        state.isCreateSuccess = true;
      })
      .addCase(createNewBook.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateBook.fulfilled, (state) => {
        state.isUpdateSuccess = true;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteBook.fulfilled, (state) => {
        state.isDeleteSuccess = true;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = bookSlice.actions;

export default bookSlice.reducer;
