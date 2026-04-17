import React, { useState } from 'react'
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteClick = () => {
    setConfirmDelete(true)
  }

  const handleConfirmDelete = () => {
    setConfirmDelete(false)
    onDelete(address._id)
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  return (
    <div className={`relative bg-white rounded-lg border p-4 shadow-sm transition ${address.isDefault ? 'border-green-400' : 'border-gray-200'}`}>
      {/* Default badge */}
      {address.isDefault && (
        <span className='absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full'>
          <FaCheckCircle className='text-green-500' />
          Default
        </span>
      )}

      {/* Address details */}
      <div className='flex items-start gap-2 mb-3'>
        <MdLocationOn className='text-red-500 text-xl mt-0.5 flex-shrink-0' />
        <div className='text-sm text-gray-700 space-y-0.5'>
          <p className='font-semibold text-gray-900'>{address.fullName}</p>
          <p>{address.phone}</p>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} {address.postalCode}</p>
          <p>{address.country}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100'>
        {/* Edit */}
        <button
          onClick={() => onEdit(address)}
          className='flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition'
        >
          <FaEdit />
          Edit
        </button>

        {/* Set as Default — hidden if already default */}
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address._id)}
            className='flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium transition'
          >
            <FaCheckCircle />
            Set as Default
          </button>
        )}

        {/* Delete with inline confirmation */}
        {!confirmDelete ? (
          <button
            onClick={handleDeleteClick}
            className='flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition ml-auto'
          >
            <FaTrash />
            Delete
          </button>
        ) : (
          <div className='flex items-center gap-2 ml-auto'>
            <span className='text-xs text-gray-600 font-medium'>Are you sure?</span>
            <button
              onClick={handleConfirmDelete}
              className='text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded transition'
            >
              Confirm
            </button>
            <button
              onClick={handleCancelDelete}
              className='text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded transition'
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressCard
