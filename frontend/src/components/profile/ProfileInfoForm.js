import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaSpinner, FaUser, FaPhoneAlt } from 'react-icons/fa'
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
        toast.success('Profile updated successfully')
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='glass rounded-3xl p-8 shadow-2xl border-white border-opacity-40'
    >
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg'>
          <FaUser />
        </div>
        <h2 className='text-2xl font-bold text-slate-800 tracking-tight'>Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Name field */}
        <div className='space-y-2'>
          <label htmlFor='name' className='block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>
            Full Name <span className='text-rose-500'>*</span>
          </label>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <FaUser className={`transition-colors duration-200 ${errors.name ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
            </div>
            <input
              id='name'
              name='name'
              type='text'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your full name'
              className={`w-full bg-white bg-opacity-50 border-2 rounded-2xl pl-11 pr-4 py-3.5 text-slate-700 outline-none transition-all duration-300 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/10 ${
                errors.name ? 'border-rose-200 focus:border-rose-400' : 'border-slate-100 focus:border-indigo-400'
              }`}
            />
          </div>
          {errors.name && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className='text-xs text-rose-500 font-medium ml-1'>{errors.name}</motion.p>
          )}
        </div>

        {/* Phone field */}
        <div className='space-y-2'>
          <label htmlFor='phone' className='block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>
            Phone Number
          </label>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <FaPhoneAlt className={`transition-colors duration-200 ${errors.phone ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
            </div>
            <input
              id='phone'
              name='phone'
              type='text'
              value={formData.phone}
              onChange={handleChange}
              placeholder='+1 234 567 8900'
              className={`w-full bg-white bg-opacity-50 border-2 rounded-2xl pl-11 pr-4 py-3.5 text-slate-700 outline-none transition-all duration-300 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/10 ${
                errors.phone ? 'border-rose-200 focus:border-rose-400' : 'border-slate-100 focus:border-indigo-400'
              }`}
            />
          </div>
          {errors.phone && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className='text-xs text-rose-500 font-medium ml-1'>{errors.phone}</motion.p>
          )}
        </div>

        {/* Submit button */}
        <div className='pt-4'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={loading}
            className='w-full premium-gradient hover:shadow-2xl hover:shadow-indigo-500/30 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl'
          >
            {loading ? <FaSpinner className='animate-spin text-xl' /> : null}
            <span className='tracking-wide'>{loading ? 'Updating Profile...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default ProfileInfoForm

