import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAddresses } from '../store/addressSlice'
import { setUserDetails } from '../store/userSlice'
import ProfilePicUpload from '../components/profile/ProfilePicUpload'
import ProfileInfoForm from '../components/profile/ProfileInfoForm'
import AddressManager from '../components/profile/AddressManager'
import Context from '../context'
import SummaryApi from '../common'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fetchUserDetails } = useContext(Context)

  const user = useSelector(state => state?.user?.user)

  // Auth guard
  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch addresses on mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAddresses())
    }
  }, [user?._id, dispatch])

  if (!user?._id) {
    return null
  }

  return (
    <div className='container mx-auto p-4 min-h-screen max-w-4xl'>
      <h1 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-8'>My Profile</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left column — avatar */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow p-6 flex flex-col items-center gap-4'>
            <ProfilePicUpload />
            <div className='text-center'>
              <p className='font-semibold text-gray-800 text-lg'>{user.name}</p>
              <p className='text-sm text-gray-500'>{user.email}</p>
              <span className='inline-block mt-2 px-3 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full capitalize'>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right column — form + addresses */}
        <div className='lg:col-span-2 space-y-8'>
          <ProfileInfoForm />
          <AddressManager />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
