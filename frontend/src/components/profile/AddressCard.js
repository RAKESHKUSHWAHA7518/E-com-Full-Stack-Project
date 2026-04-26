import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEdit, FaTrash, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa'
import { MdPhone } from 'react-icons/md'

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
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      className={`relative glass rounded-2xl p-6 shadow-xl transition-all duration-300 border-2 ${
        address.isDefault ? 'border-indigo-400 bg-white bg-opacity-90' : 'border-white border-opacity-40'
      }`}
    >
      {/* Default badge */}
      <AnimatePresence>
        {address.isDefault && (
          <motion.span 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='absolute -top-3 -right-3 flex items-center gap-1.5 premium-gradient text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider'
          >
            <FaCheckCircle className='text-xs' />
            Default
          </motion.span>
        )}
      </AnimatePresence>

      {/* Address details */}
      <div className='flex items-start gap-4 mb-4'>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${
          address.isDefault ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'
        }`}>
          <FaMapMarkerAlt className='text-xl' />
        </div>
        
        <div className='flex-1 space-y-1'>
          <p className='font-bold text-slate-800 text-lg leading-tight'>{address.fullName}</p>
          <div className='flex items-center gap-2 text-slate-500 text-sm'>
            <MdPhone className='text-indigo-400' />
            <p className='font-medium'>{address.phone}</p>
          </div>
          <div className='mt-3 pt-3 border-t border-slate-100'>
            <p className='text-slate-600 text-sm leading-relaxed'>{address.addressLine1}</p>
            {address.addressLine2 && <p className='text-slate-600 text-sm leading-relaxed'>{address.addressLine2}</p>}
            <p className='text-slate-700 font-semibold text-sm mt-1'>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className='text-slate-400 text-xs font-bold uppercase tracking-widest mt-1'>{address.country}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex items-center justify-between mt-4 pt-4 border-t border-slate-100'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => onEdit(address)}
            className='flex items-center gap-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest'
          >
            <FaEdit className='text-sm' />
            Edit
          </button>

          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address._id)}
              className='flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-700 transition-colors uppercase tracking-widest'
            >
              <FaCheckCircle className='text-sm' />
              Set Default
            </button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <AnimatePresence mode='wait'>
            {!confirmDelete ? (
              <motion.button
                key="delete-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleDeleteClick}
                className='w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all'
              >
                <FaTrash />
              </motion.button>
            ) : (
              <motion.div 
                key="confirm-delete"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='flex items-center gap-2 bg-rose-50 p-1 rounded-lg'
              >
                <button
                  onClick={handleConfirmDelete}
                  className='text-[10px] font-bold bg-rose-500 text-white px-2 py-1 rounded uppercase tracking-wider'
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className='text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded uppercase tracking-wider'
                >
                  No
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default AddressCard

