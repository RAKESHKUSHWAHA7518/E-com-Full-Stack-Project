import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { localToggle, toggleWishlistItem, selectIsWishlisted } from '../store/wishlistSlice'

/**
 * HeartButton
 * Props:
 *   productId  — the product's _id string
 *   showLabel  — if true, renders a full button with text (for ProductDetails page)
 */
const HeartButton = ({ productId, showLabel = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user)
  const isWishlisted = useSelector(selectIsWishlisted(productId))
  const [busy, setBusy] = useState(false)

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?._id) {
      navigate('/login')
      return
    }

    if (busy) return
    setBusy(true)

    // Optimistic — flip immediately
    dispatch(localToggle(productId))

    try {
      const result = await dispatch(toggleWishlistItem(String(productId))).unwrap()
      toast.success(result.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist')
    } catch (err) {
      // Rollback
      dispatch(localToggle(productId))
      toast.error(typeof err === 'string' ? err : 'Could not update wishlist')
    } finally {
      setBusy(false)
    }
  }

  if (showLabel) {
    return (
      <button
        onClick={handleClick}
        disabled={busy}
        className={`flex items-center gap-2 border-2 rounded px-3 py-1 min-w-[150px] font-medium transition-colors
          ${busy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isWishlisted
            ? 'border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500'
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
          }`}
      >
        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow text-lg
        transition-all duration-150
        ${busy ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
        ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
    >
      {isWishlisted ? <FaHeart /> : <FaRegHeart />}
    </button>
  )
}

export default HeartButton
