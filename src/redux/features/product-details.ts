import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState = {
  value: {
    title: "",
    name_ar: "",
    name_en: "",
    reviews: 0,
    price: 0,
    discountedPrice: 0,
    offer_price: 0,
    img: "",
    images: [],
    id: 0,
    image_url: "",
    imgs: { thumbnails: [], previews: [] },
    description: "",
    description_ar: "",
    description_en: "",
    stock: 0,
    attributes: [],
  },
} as InitialState;

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
