import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { useNavigate } from 'react-router-dom'
import StarRating from './reviews/StarRating'
import HeartButton from './HeartButton'

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null)
  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const handleAddToCart = async (e, id) => {
    e.stopPropagation()
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const goToProduct = (id) => {
    scrollTop()
    navigate('/product/' + id)
  }

  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
      {loading
        ? loadingList.map((_, index) => (
            <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
              <div className='bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse' />
              <div className='p-4 grid gap-3'>
                <h2 className='font-medium h-6 animate-pulse rounded-full bg-slate-200' />
                <p className='h-5 animate-pulse rounded-full bg-slate-200' />
                <div className='flex gap-3'>
                  <p className='h-5 animate-pulse rounded-full bg-slate-200 w-full' />
                  <p className='h-5 animate-pulse rounded-full bg-slate-200 w-full' />
                </div>
                <button className='h-7 animate-pulse rounded-full bg-slate-200' />
              </div>
            </div>
          ))
        : data.map((product) => (
            <div
              key={product?._id}
              className='w-full min-w-[280px] md:min-w-[300px] max-w-[280px] md:max-w-[300px] bg-white rounded-sm shadow cursor-pointer'
              onClick={() => goToProduct(product?._id)}
            >
              <div className='bg-slate-200 h-48 p-4 flex justify-center items-center relative'>
                <img
                  src={product?.productImage[0]}
                  className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'
                  alt={product?.productName}
                />
                {/* Heart button — stopPropagation prevents card navigation */}
                <div
                  className='absolute top-2 right-2'
                  onClick={e => e.stopPropagation()}
                >
                  <HeartButton productId={product?._id} />
                </div>
              </div>
              <div className='p-4 grid gap-3'>
                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                  {product?.productName}
                </h2>
                <p className='capitalize text-slate-500'>{product?.category}</p>
                {product?.reviewCount > 0 && (
                  <StarRating rating={product?.averageRating || 0} count={product?.reviewCount || 0} size="sm" />
                )}
                <div className='flex gap-3'>
                  <p className='text-red-600 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                  <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                </div>
                <button
                  className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'
                  onClick={e => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
    </div>
  )
}

export default VerticalCard
