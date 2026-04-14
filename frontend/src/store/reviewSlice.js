import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SummaryApi from '../common';

const backendDomain = process.env.REACT_APP_BACKEND_URL;

export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  async ({ productId, page = 1, pageSize = 10, sort = 'createdAt' }, { rejectWithValue }) => {
    try {
      const url = `${backendDomain}/api/reviews/${productId}?page=${page}&pageSize=${pageSize}&sort=${sort}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitReview = createAsyncThunk(
  'review/submitReview',
  async ({ productId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const res = await fetch(SummaryApi.createReview.url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, reviewText })
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editReview = createAsyncThunk(
  'review/editReview',
  async ({ reviewId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const url = `${backendDomain}/api/reviews/${reviewId}`;
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, reviewText })
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeReview = createAsyncThunk(
  'review/removeReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const url = `${backendDomain}/api/reviews/${reviewId}`;
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const voteHelpful = createAsyncThunk(
  'review/voteHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      const url = `${backendDomain}/api/reviews/${reviewId}/helpful`;
      const res = await fetch(url, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviews: [],
    aggregates: {
      averageRating: 0,
      reviewCount: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    pagination: { page: 1, totalPages: 1, pageSize: 10 },
    sort: 'createdAt',
    loading: false,
    submitting: false,
    error: null
  },
  reducers: {
    setSort(state, action) {
      state.sort = action.payload;
    },
    clearReviews(state) {
      state.reviews = [];
      state.aggregates = { averageRating: 0, reviewCount: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProductReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.aggregates = action.payload.aggregates;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // submit
      .addCase(submitReview.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.unshift(action.payload);
        state.aggregates.reviewCount += 1;
      })
      .addCase(submitReview.rejected, (state, action) => { state.submitting = false; state.error = action.payload; })
      // edit
      .addCase(editReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = action.payload;
      })
      // remove
      .addCase(removeReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        if (state.aggregates.reviewCount > 0) state.aggregates.reviewCount -= 1;
      })
      // helpful vote
      .addCase(voteHelpful.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = action.payload;
      });
  }
});

export const { setSort, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
