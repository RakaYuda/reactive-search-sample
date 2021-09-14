import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  token: string;
  cart: Product[];
}

const initialState = {
  user: null,
  isLoggedIn: false,
  token: "",
  cart: [],
} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addProductToUserCart(state, action) {
      const product = action.payload;
      const { id } = product;
      const existingProduct = state.cart.find((product) => product.id === id);
      if (!existingProduct) {
        state.cart = state.cart.concat(product);
      }
    },
  },
});

export const { addProductToUserCart } = userSlice.actions;

export default userSlice.reducer;
