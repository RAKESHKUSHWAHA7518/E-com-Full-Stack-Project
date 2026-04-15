import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import SummaryApi from '../common'

// Fetch wishlist from server — returns array of productId strings
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(SummaryApi.wishlistGet.url, {
        method: SummaryApi.wishlistGet.method,
        credentials: 'include'
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data // string[]
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Toggle a product in/out of wishlist
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(SummaryApi.wishlistToggle.url, {
        method: SummaryApi.wishlistToggle.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data // { action: 'added'|'removed', productId: string }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],       // productId strings
    loading: false,
    error: null
  },
  reducers: {
    // Instant local toggle before server responds
    localToggle(state, action) {
      const id = String(action.payload)
      const idx = state.items.findIndex(x => String(x) === id)
      if (idx === -1) {
        state.items.push(id)
      } else {
        state.items.splice(idx, 1)
      }
    },
    clearWishlist(state) {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.items = (action.payload || []).map(id => String(id))
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        // Don't clear items on rejection — keeps optimistic state intact
      })
      // After server confirms, reconcile state with server truth
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const { action: act, productId } = action.payload
        const id = String(productId)
        const idx = state.items.findIndex(x => String(x) === id)
        if (act === 'added' && idx === -1) {
          state.items.push(id)
        } else if (act === 'removed' && idx !== -1) {
          state.items.splice(idx, 1)
        }
      })
      .addCase(toggleWishlistItem.rejected, (state) => {
        // Rollback is handled in the component via localToggle
      })
  }
})

export const { localToggle, clearWishlist } = wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some(id => String(id) === String(productId))

export default wishlistSlice.reducer
