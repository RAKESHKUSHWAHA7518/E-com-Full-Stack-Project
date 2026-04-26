import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAddresses } from '../store/addressSlice'
import ProfilePicUpload from '../components/profile/ProfilePicUpload'
import ProfileInfoForm from '../components/profile/ProfileInfoForm'
import AddressManager from '../components/profile/AddressManager'
import Context from '../context'

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-slate-50 pb-12'
    >
      {/* Premium Banner */}
      <div className='relative h-48 lg:h-64 premium-gradient overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-10'></div>
        <div className='absolute -bottom-16 left-0 right-0 h-32 bg-slate-50 skew-y-2 origin-bottom-right transform scale-110'></div>
      </div>

      <div className='container mx-auto px-4 max-w-6xl relative -mt-24 lg:-mt-32'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          
          {/* Left Column - User Overview */}
          <div className='lg:col-span-4'>
            <motion.div 
              whileHover={{ y: -5 }}
              className='glass rounded-3xl p-8 flex flex-col items-center text-center sticky top-24 shadow-2xl border-white border-opacity-40'
            >
              <ProfilePicUpload />
              
              <div className='mt-6'>
                <h1 className='text-3xl font-bold text-slate-800 tracking-tight'>{user.name}</h1>
                <p className='text-slate-500 font-medium mt-1'>{user.email}</p>
                
                <div className='mt-4 flex items-center justify-center gap-2'>
                  <span className='px-4 py-1.5 premium-gradient text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg'>
                    {user.role}
                  </span>
                  <span className='px-4 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider border border-slate-100 shadow-sm'>
                    Verified
                  </span>
                </div>
              </div>

              <div className='mt-8 pt-8 border-t border-slate-100 w-full grid grid-cols-2 gap-4'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-slate-800'>12</p>
                  <p className='text-xs text-slate-400 font-semibold uppercase'>Orders</p>
                </div>
                <div className='text-center border-l border-slate-100'>
                  <p className='text-2xl font-bold text-slate-800'>5</p>
                  <p className='text-xs text-slate-400 font-semibold uppercase'>Reviews</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details & Forms */}
          <div className='lg:col-span-8 space-y-8'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfileInfoForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AddressManager />
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default ProfilePage

