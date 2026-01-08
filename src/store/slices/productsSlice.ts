// store/slices/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductsState } from "../../types";
import { productsAPI } from "../../services/api";

const ITEMS_PER_PAGE = 20;

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: "all",
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ page = 1 }: { page?: number } = {}) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const data = await productsAPI.getAllProducts(skip, ITEMS_PER_PAGE);
    return {
      products: data.products,
      total: data.total,
      currentPage: page,
      skip: data.skip,
      limit: data.limit,
    };
  }
);

// fetch products by category with pagination
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async ({ category, page = 1 }: { category: string; page?: number }) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    let data;
    if (category === "all") {
      data = await productsAPI.getAllProducts(skip, ITEMS_PER_PAGE);
    } else {
      data = await productsAPI.getProductsByCategory(
        category,
        skip,
        ITEMS_PER_PAGE
      );
    }

    return {
      products: data.products,
      total: data.total,
      currentPage: page,
      category,
    };
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const data = await productsAPI.getCategories();
    if (Array.isArray(data)) {
      return data
        .map((category: any) => {
          if (typeof category === "object" && category.slug) {
            return category.slug;
          }
          return category;
        })
        .filter(Boolean);
    }
    return [];
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.totalProducts = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / ITEMS_PER_PAGE);
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.totalProducts = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / ITEMS_PER_PAGE);
        state.currentPage = action.payload.currentPage;
        state.selectedCategory = action.payload.category;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = ["all", ...action.payload];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const { setCurrentPage, setSelectedCategory } = productsSlice.actions;
export default productsSlice.reducer;
