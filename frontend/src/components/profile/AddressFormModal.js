import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaTimes, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa'
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
  <div className='space-y-1'>
    <label htmlFor={name} className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
      {label}
      {required && <span className='text-rose-500 ml-0.5'>*</span>}
      {optional && <span className='text-slate-300 text-[10px] ml-1'>(optional)</span>}
    </label>
    <input
      id={name}
      name={name}
      type='text'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/5 ${
        error ? 'border-rose-200 focus:border-rose-400' : 'border-slate-100 focus:border-indigo-300'
      }`}
    />
    {error && <p className='mt-1 text-[10px] text-rose-500 font-bold ml-1'>{error}</p>}
  </div>
)

const AddressFormModal = ({ isOpen, onClose, address }) => {
  const dispatch = useDispatch()
  const isEditMode = Boolean(address)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'
        onClick={handleOverlayClick}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className='bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col'
        >
          {/* Header */}
          <div className='flex items-center justify-between px-8 py-6 border-b border-slate-100'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg'>
                <FaMapMarkerAlt />
              </div>
              <h2 className='text-xl font-bold text-slate-800 tracking-tight'>
                {isEditMode ? 'Edit Address' : 'New Address'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all'
              aria-label='Close modal'
            >
              <FaTimes className='text-lg' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='px-8 py-6 space-y-5 overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
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
                placeholder='+1 234 567 8900'
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
              placeholder='Apt, Suite, Floor (optional)'
              optional
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
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

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
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
            <div className='flex items-center gap-4 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 py-3.5 rounded-2xl border-2 border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all uppercase tracking-widest'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-[2] flex items-center justify-center gap-3 py-3.5 rounded-2xl premium-gradient text-white text-sm font-bold shadow-xl hover:shadow-indigo-500/30 disabled:opacity-60 transition-all uppercase tracking-widest'
              >
                {loading && <FaSpinner className='animate-spin' />}
                <span>{loading ? 'Saving...' : isEditMode ? 'Update Address' : 'Save Address'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddressFormModal

