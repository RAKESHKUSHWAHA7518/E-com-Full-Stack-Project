import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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

    // Reset input so the same file can be re-selected if needed
    e.target.value = ''

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are supported.')
      return
    }

    // Validate size (≤ 2 MB)
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`Image must be ${MAX_FILE_SIZE_MB} MB or smaller.`)
      return
    }

    setUploading(true)
    try {
      // Upload to Cloudinary via existing helper
      const cloudinaryResponse = await uploadimage(file)

      if (!cloudinaryResponse?.secure_url) {
        throw new Error('Cloudinary upload failed')
      }

      const profilePicUrl = cloudinaryResponse.secure_url

      // Persist URL to backend
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
    <div className='flex flex-col items-center gap-3'>
      {/* Avatar with upload overlay */}
      <div
        className='relative w-28 h-28 cursor-pointer group'
        onClick={handleAvatarClick}
        title='Click to change profile picture'
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name || 'Profile'}
            className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-md'
          />
        ) : (
          <FaUserCircle className='w-28 h-28 text-gray-400' />
        )}

        {/* Hover / loading overlay */}
        <div className='absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
          {uploading ? (
            <FaSpinner className='text-white text-2xl animate-spin' />
          ) : (
            <FaCamera className='text-white text-2xl' />
          )}
        </div>

        {/* Always-visible spinner when uploading */}
        {uploading && (
          <div className='absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center'>
            <FaSpinner className='text-white text-2xl animate-spin' />
          </div>
        )}
      </div>

      <p className='text-xs text-gray-500'>JPEG, PNG or WebP · max 2 MB</p>

      {/* Hidden file input */}
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
