import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTimes, FaSpinner } from 'react-icons/fa'
import { addAddress, updateAddress } from '../../store/addressSlice'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

const validate = (data) => {
  const errors = {}

  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!data.phone.trim()) {
    errors.phone = 'Phone is required.'
  } else if (!/^\+?[0-9]{10,15}$/.test(data.phone)) {
    errors.phone = 'Phone must be 10–15 digits, optionally starting with +.'
  }
  if (!data.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required.'
  if (!data.city.trim()) errors.city = 'City is required.'
  if (!data.state.trim()) errors.state = 'State is required.'
  if (!data.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.'
  } else if (!/^[A-Za-z0-9\-]{3,10}$/.test(data.postalCode)) {
    errors.postalCode = 'Postal code must be 3–10 alphanumeric characters (hyphens allowed).'
  }
  if (!data.country.trim()) errors.country = 'Country is required.'

  return errors
}

const Field = ({ label, name, value, onChange, error, placeholder, required, optional }) => (
  <div>
    <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
      {required && <span className='text-red-500 ml-0.5'>*</span>}
      {optional && <span className='text-gray-400 text-xs ml-1'>(optional)</span>}
    </label>
    <input
      id={name}
      name={name}
      type='text'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 transition ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
  </div>
)

const AddressFormModal = ({ isOpen, onClose, address }) => {
  const dispatch = useDispatch()
  const isEditMode = Boolean(address)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({
          fullName: address.fullName || '',
          phone: address.phone || '',
          addressLine1: address.addressLine1 || '',
          addressLine2: address.addressLine2 || '',
          city: address.city || '',
          state: address.state || '',
          postalCode: address.postalCode || '',
          country: address.country || '',
        })
      } else {
        setFormData(EMPTY_FORM)
      }
      setErrors({})
    }
  }, [isOpen, address])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      let result
      if (isEditMode) {
        result = await dispatch(updateAddress({ addressId: address._id, addressData: formData }))
      } else {
        result = await dispatch(addAddress(formData))
      }

      // Check if the thunk was rejected
      if (result.type?.endsWith('/rejected')) {
        toast.error(result.payload || 'Failed to save address')
      } else {
        toast.success(isEditMode ? 'Address updated' : 'Address added')
        onClose()
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={handleOverlayClick}
    >
      <div className='bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {isEditMode ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition'
            aria-label='Close modal'
          >
            <FaTimes className='text-xl' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-6 py-5 space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field
              label='Full Name'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder='John Doe'
              required
            />
            <Field
              label='Phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder='+1234567890'
              required
            />
          </div>

          <Field
            label='Address Line 1'
            name='addressLine1'
            value={formData.addressLine1}
            onChange={handleChange}
            error={errors.addressLine1}
            placeholder='123 Main Street'
            required
          />

          <Field
            label='Address Line 2'
            name='addressLine2'
            value={formData.addressLine2}
            onChange={handleChange}
            error={errors.addressLine2}
            placeholder='Apt, Suite, Floor...'
            optional
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field
              label='City'
              name='city'
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder='New York'
              required
            />
            <Field
              label='State / Province'
              name='state'
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              placeholder='NY'
              required
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field
              label='Postal Code'
              name='postalCode'
              value={formData.postalCode}
              onChange={handleChange}
              error={errors.postalCode}
              placeholder='10001'
              required
            />
            <Field
              label='Country'
              name='country'
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
              placeholder='United States'
              required
            />
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition'
            >
              {loading && <FaSpinner className='animate-spin' />}
              {loading ? 'Saving...' : isEditMode ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddressFormModal
