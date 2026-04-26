import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaCamera, FaSpinner } from 'react-icons/fa'
import SummaryApi from '../../common'
import { setUserDetails } from '../../store/userSlice'
import uploadimage from '../../helpers/uploadimage'

const MAX_FILE_SIZE_MB = 2
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const ProfilePicUpload = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user?.user)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are supported.')
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`Image must be ${MAX_FILE_SIZE_MB} MB or smaller.`)
      return
    }

    setUploading(true)
    try {
      const cloudinaryResponse = await uploadimage(file)

      if (!cloudinaryResponse?.secure_url) {
        throw new Error('Cloudinary upload failed')
      }

      const profilePicUrl = cloudinaryResponse.secure_url

      const response = await fetch(SummaryApi.uploadProfilePic.url, {
        method: SummaryApi.uploadProfilePic.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicUrl }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch(setUserDetails(data.data))
        toast.success('Profile picture updated')
      } else {
        toast.error(data.message || 'Failed to update profile picture')
      }
    } catch (err) {
      toast.error('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='relative cursor-pointer'
        onClick={handleAvatarClick}
      >
        {/* Glowing Background Ring */}
        <div className='absolute -inset-1 premium-gradient rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse'></div>
        
        <div className='relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white'>
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name || 'Profile'}
              className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
            />
          ) : (
            <div className='w-full h-full bg-slate-100 flex items-center justify-center'>
              <FaUserCircle className='w-24 h-24 text-slate-300' />
            </div>
          )}

          {/* Upload Overlay */}
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white transition-all duration-300 backdrop-blur-[2px]'
            >
              {uploading ? (
                <FaSpinner className='text-3xl animate-spin' />
              ) : (
                <>
                  <FaCamera className='text-3xl mb-1' />
                  <span className='text-[10px] font-bold uppercase tracking-wider'>Change Photo</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Loading Spinner for Uploading State */}
          {uploading && (
            <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center'>
              <FaSpinner className='text-white text-3xl animate-spin' />
            </div>
          )}
        </div>
      </motion.div>

      <div className='text-center'>
        <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>JPEG, PNG or WebP · Max 2 MB</p>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ProfilePicUpload

