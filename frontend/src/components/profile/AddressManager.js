import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaPlus } from 'react-icons/fa'
import {
  fetchAddresses,
  deleteAddress,
  setDefaultAddress,
} from '../../store/addressSlice'
import AddressCard from './AddressCard'
import AddressFormModal from './AddressFormModal'

const MAX_ADDRESSES = 5

const SkeletonCard = () => (
  <div className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse'>
    <div className='flex items-start gap-2'>
      <div className='w-5 h-5 bg-gray-200 rounded-full mt-0.5 flex-shrink-0' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 bg-gray-200 rounded w-1/3' />
        <div className='h-3 bg-gray-200 rounded w-1/4' />
        <div className='h-3 bg-gray-200 rounded w-2/3' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>
    <div className='mt-4 pt-3 border-t border-gray-100 flex gap-3'>
      <div className='h-4 bg-gray-200 rounded w-10' />
      <div className='h-4 bg-gray-200 rounded w-20' />
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
      toast.success('Address deleted')
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
    <div className='space-y-4'>
      {/* Section header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>Saved Addresses</h2>

        {/* Add New Address button */}
        <div className='relative group'>
          <button
            onClick={handleAddNew}
            disabled={atLimit}
            className='flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-full transition'
          >
            <FaPlus />
            Add New Address
          </button>

          {/* Tooltip shown when at limit */}
          {atLimit && (
            <div className='absolute right-0 top-full mt-1 z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
              Maximum 5 addresses reached
            </div>
          )}
        </div>
      </div>

      {/* Address list or skeletons */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : addresses.length === 0 ? (
        <div className='text-center py-12 text-gray-400'>
          <p className='text-lg'>No saved addresses yet.</p>
          <p className='text-sm mt-1'>Click "Add New Address" to get started.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {addresses.map(address => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <AddressFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        address={editingAddress}
      />
    </div>
  )
}

export default AddressManager
