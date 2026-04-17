import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaSpinner } from 'react-icons/fa'
import SummaryApi from '../../common'
import { setUserDetails } from '../../store/userSlice'

const ProfileInfoForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user?.user)

  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const validate = () => {
    const newErrors = {}

    if (!formData.name || formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters.'
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10–15 digits, optionally starting with +.'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(SummaryApi.updateProfile.url, {
        method: SummaryApi.updateProfile.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), phone: formData.phone }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch(setUserDetails(data.data))
        toast.success('Profile updated')
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6 space-y-5'>
      <h2 className='text-xl font-semibold text-gray-800'>Profile Information</h2>

      {/* Name field */}
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
          Full Name <span className='text-red-500'>*</span>
        </label>
        <input
          id='name'
          name='name'
          type='text'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your full name'
          className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 transition ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className='mt-1 text-xs text-red-500'>{errors.name}</p>
        )}
      </div>

      {/* Phone field */}
      <div>
        <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
          Phone Number
        </label>
        <input
          id='phone'
          name='phone'
          type='text'
          value={formData.phone}
          onChange={handleChange}
          placeholder='+1234567890 (optional)'
          className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 transition ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <p className='mt-1 text-xs text-red-500'>{errors.phone}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type='submit'
        disabled={loading}
        className='flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-full transition'
      >
        {loading && <FaSpinner className='animate-spin' />}
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default ProfileInfoForm
