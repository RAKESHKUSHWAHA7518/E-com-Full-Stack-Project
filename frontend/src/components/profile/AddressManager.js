import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaPlus, FaMapMarkedAlt } from 'react-icons/fa'
import {
  fetchAddresses,
  deleteAddress,
  setDefaultAddress,
} from '../../store/addressSlice'
import AddressCard from './AddressCard'
import AddressFormModal from './AddressFormModal'

const MAX_ADDRESSES = 5

const SkeletonCard = () => (
  <div className='glass rounded-2xl p-6 shadow-sm animate-pulse space-y-4'>
    <div className='flex items-start gap-4'>
      <div className='w-12 h-12 bg-slate-200 rounded-xl flex-shrink-0' />
      <div className='flex-1 space-y-2'>
        <div className='h-5 bg-slate-200 rounded w-1/2' />
        <div className='h-4 bg-slate-200 rounded w-1/3' />
      </div>
    </div>
    <div className='pt-4 border-t border-slate-100 space-y-2'>
      <div className='h-4 bg-slate-100 rounded w-full' />
      <div className='h-4 bg-slate-100 rounded w-2/3' />
    </div>
  </div>
)

const AddressManager = () => {
  const dispatch = useDispatch()
  const { addresses, loading } = useSelector(state => state.address)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  const handleAddNew = () => {
    setEditingAddress(null)
    setModalOpen(true)
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingAddress(null)
  }

  const handleDelete = async (addressId) => {
    const result = await dispatch(deleteAddress(addressId))
    if (result.type?.endsWith('/fulfilled')) {
      toast.success('Address removed successfully')
    } else {
      toast.error(result.payload || 'Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId) => {
    const result = await dispatch(setDefaultAddress(addressId))
    if (result.type?.endsWith('/fulfilled')) {
      toast.success('Default address updated')
    } else {
      toast.error(result.payload || 'Failed to set default address')
    }
  }

  const atLimit = addresses.length >= MAX_ADDRESSES

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className='glass rounded-3xl p-8 shadow-2xl border-white border-opacity-40'
    >
      {/* Section header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg'>
            <FaMapMarkedAlt />
          </div>
          <h2 className='text-2xl font-bold text-slate-800 tracking-tight'>Saved Addresses</h2>
        </div>

        {/* Add New Address button */}
        <div className='relative group'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            disabled={atLimit}
            className='flex items-center gap-2 premium-gradient hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-lg'
          >
            <FaPlus />
            Add New Address
          </motion.button>

          {atLimit && (
            <div className='absolute right-0 top-full mt-2 z-10 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl'>
              Maximum {MAX_ADDRESSES} addresses reached
            </div>
          )}
        </div>
      </div>

      {/* Address list or skeletons */}
      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div 
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <SkeletonCard />
            <SkeletonCard />
          </motion.div>
        ) : addresses.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center py-16 bg-slate-50 bg-opacity-50 rounded-3xl border-2 border-dashed border-slate-200'
          >
            <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm'>
              <FaMapMarkedAlt className='text-slate-300 text-2xl' />
            </div>
            <p className='text-slate-500 font-bold uppercase tracking-widest text-sm'>No saved addresses yet</p>
            <p className='text-slate-400 text-xs mt-2'>Add your first shipping address to get started</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AddressCard
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit modal */}
      <AddressFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        address={editingAddress}
      />
    </motion.div>
  )
}

export default AddressManager

