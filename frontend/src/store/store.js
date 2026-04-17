
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import paymentReducer from './paymentSlice'
import orderReducer from './orderSlice'
import reviewReducer from './reviewSlice'
import wishlistReducer from './wishlistSlice'
import addressReducer from './addressSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    order: orderReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    address: addressReducer
  },
})