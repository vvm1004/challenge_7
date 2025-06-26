// src/redux/book/bookSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createProductAPI,
  deleteProductAPI,
  getProductsAPI,
  getProductByIdAPI,
  updateProductAPI,
} from "@/services/api";

interface ProductState {
  listProducts: IProductTable[];
  total: number;
  selectedProduct?: IProductTable;
  isCreateSuccess: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  loading: boolean;
  error?: string;
}

const initialState: ProductState = {
  listProducts: [],
  total: 0,
  loading: false,
  isCreateSuccess: false,
  isUpdateSuccess: false,
  isDeleteSuccess: false,
  error: undefined,
};

// Async thunks
export const fetchListProducts = createAsyncThunk(
  "books/fetchListProducts",
  async (params: Record<string, any>, thunkAPI) => {
    try {
      const res = await getProductsAPI(params);
      return res; // { result: [...], total: number }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createNewProduct = createAsyncThunk(
  "books/createNewProduct",
  async (data: IProductTable, thunkAPI) => {
    const res = await createProductAPI(data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "books/updateProduct",
  async ({ id, data }: { id: number; data: Partial<IProductTable> }, thunkAPI) => {
    const res = await updateProductAPI(id, data);
    if (res.success) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "books/deleteProduct",
  async (id: number, thunkAPI) => {
    const res = await deleteProductAPI(id);
    if (res.success) {
      return id;
    } else {
      return thunkAPI.rejectWithValue(res.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "books/fetchProductById",
  async (id: number, thunkAPI) => {
    try {
      const res = await getProductByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "product",
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
      .addCase(fetchListProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.listProducts = action.payload.result;
        state.total = action.payload.total;
      })
      .addCase(fetchListProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createNewProduct.fulfilled, (state) => {
        state.isCreateSuccess = true;
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateProduct.fulfilled, (state) => {
        state.isUpdateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteProduct.fulfilled, (state) => {
        state.isDeleteSuccess = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = productSlice.actions;

export default productSlice.reducer;
