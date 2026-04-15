import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'

const AdminWishlistAnalytics = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(SummaryApi.wishlistAnalytics.url, {
          method: SummaryApi.wishlistAnalytics.method,
          credentials: 'include'
        })
        if (res.status === 403) {
          setError('Access denied. Admins only.')
          return
        }
        const json = await res.json()
        if (!json.success) {
          setError(json.message || 'Failed to load analytics')
          return
        }
        setData(json.data)
      } catch (err) {
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className='p-6 text-gray-500'>Loading analytics...</div>
  if (error) return <div className='p-6 text-red-500 font-semibold'>{error}</div>

  return (
    <div className='bg-white shadow rounded-lg p-4'>
      <h2 className='text-xl font-bold mb-4'>Wishlist Analytics — Top 20 Products</h2>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100 text-gray-700 text-left'>
              <th className='p-3 font-semibold'>Image</th>
              <th className='p-3 font-semibold'>Product Name</th>
              <th className='p-3 font-semibold'>Category</th>
              <th className='p-3 font-semibold'>Wishlist Count</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className='p-6 text-center text-gray-400'>No wishlist data yet.</td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={String(item.productId)} className='border-t border-gray-200 hover:bg-slate-50'>
                  <td className='p-3'>
                    <img
                      src={Array.isArray(item.productImage) ? item.productImage[0] : item.productImage}
                      alt={item.productName}
                      className='w-14 h-14 object-cover rounded'
                    />
                  </td>
                  <td className='p-3 font-medium text-gray-800'>{item.productName}</td>
                  <td className='p-3 text-gray-600 capitalize'>{item.category}</td>
                  <td className='p-3 font-semibold text-gray-800'>{item.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminWishlistAnalytics
