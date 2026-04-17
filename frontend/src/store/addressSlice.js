import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import SummaryApi from '../common'

// Fetch all addresses for the current user
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(SummaryApi.getAddresses.url, {
        method: SummaryApi.getAddresses.method,
        credentials: 'include'
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Add a new address
export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await fetch(SummaryApi.addAddress.url, {
        method: SummaryApi.addAddress.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Update an existing address
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${SummaryApi.updateAddress.url}/${addressId}`, {
        method: SummaryApi.updateAddress.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Delete an address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${SummaryApi.deleteAddress.url}/${addressId}`, {
        method: SummaryApi.deleteAddress.method,
        credentials: 'include'
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Set an address as default
export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${SummaryApi.setDefaultAddress.url}/${addressId}/default`, {
        method: SummaryApi.setDefaultAddress.method,
        credentials: 'include'
      })
      const data = await res.json()
      if (!data.success) return rejectWithValue(data.message)
      return data.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchAddresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // addAddress
      .addCase(addAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // updateAddress
      .addCase(updateAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // setDefaultAddress
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

// Selectors
export const selectAddresses = (state) => state.address.addresses
export const selectDefaultAddress = (state) =>
  state.address.addresses.find((addr) => addr.isDefault === true) || null

export default addressSlice.reducer
