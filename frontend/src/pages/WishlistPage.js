import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import addToCart from '../helpers/addToCart'
import { selectWishlistItems, toggleWishlistItem, localToggle } from '../store/wishlistSlice'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fetchUserAddToCart } = useContext(Context)

  const user = useSelector(state => state?.user?.user)
  const wishlistIds = useSelector(selectWishlistItems)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Auth guard
  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch product details for every id in the wishlist
  useEffect(() => {
    if (!user?._id || wishlistIds.length === 0) {
      setProducts([])
      return
    }

    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          wishlistIds.map(id =>
            fetch(SummaryApi.productDetails.url, {
              method: SummaryApi.productDetails.method,
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: id })
            }).then(r => r.json())
          )
        )
        setProducts(results.filter(r => r?.data).map(r => r.data))
      } catch (err) {
        console.error('WishlistPage fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [wishlistIds.join(','), user?._id]) // join to avoid reference equality issues

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const handleRemove = async (productId) => {
    // Optimistic remove from local list
    setProducts(prev => prev.filter(p => String(p._id) !== String(productId)))
    dispatch(localToggle(productId))

    try {
      await dispatch(toggleWishlistItem(String(productId))).unwrap()
    } catch (err) {
      toast.error('Could not remove from wishlist')
      // Reload page to restore correct state
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto' />
          <p className='mt-4 text-gray-600'>Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4 min-h-screen'>
      <h1 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-6'>My Wishlist</h1>

      {products.length === 0 ? (
        <div className='bg-white rounded-lg shadow-md p-10 text-center'>
          <div className='text-6xl text-gray-200 mb-4'>♡</div>
          <h2 className='text-xl font-semibold text-gray-700 mb-2'>Your wishlist is empty</h2>
          <p className='text-gray-500 mb-6'>Save products you love and come back to them anytime.</p>
          <Link to='/' className='inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors'>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map(product => (
            <div key={product._id} className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col'>
              <div
                className='h-48 bg-slate-100 rounded-t-lg overflow-hidden flex items-center justify-center p-2 cursor-pointer'
                onClick={() => navigate('/product/' + product._id)}
              >
                <img
                  src={product.productImage?.[0]}
                  alt={product.productName}
                  className='h-full w-full object-scale-down mix-blend-multiply hover:scale-105 transition-all'
                />
              </div>

              <div className='p-4 flex flex-col flex-1'>
                <h2 className='font-semibold text-gray-800 text-sm line-clamp-2 mb-1'>{product.productName}</h2>
                <p className='text-xs text-slate-400 capitalize mb-3'>{product.category}</p>

                <div className='flex items-center gap-2 mb-4'>
                  <span className='text-red-600 font-semibold'>{displayINRCurrency(product.sellingPrice)}</span>
                  <span className='text-slate-400 line-through text-sm'>{displayINRCurrency(product.price)}</span>
                </div>

                <div className='mt-auto flex flex-col gap-2'>
                  <button
                    onClick={e => handleAddToCart(e, product._id)}
                    className='w-full border-2 border-red-600 rounded px-3 py-1.5 font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white transition-colors text-sm'
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className='w-full border-2 border-slate-300 rounded px-3 py-1.5 font-medium text-slate-600 hover:border-red-400 hover:text-red-600 transition-colors text-sm'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
