import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SummaryApi from '../common/index';

// Async thunk to create checkout session
export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.createCheckoutSession.url, {
        method: SummaryApi.createCheckoutSession.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to create checkout session');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    sessionId: null,
    sessionUrl: null,
    loading: false,
    error: null
  },
  reducers: {
    resetPaymentState: (state) => {
      state.sessionId = null;
      state.sessionUrl = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.sessionUrl = action.payload.sessionUrl;
        state.error = null;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
