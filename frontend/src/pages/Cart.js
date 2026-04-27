import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete, MdShoppingCart, MdArrowForward, MdLocalShipping, MdPayment } from "react-icons/md";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        })

        const responseData = await response.json()

        if (responseData.success) {
            setData(responseData.data)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchData().finally(() => setLoading(false))
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({ _id: id, quantity: qty + 1 })
        })

        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
        }
    }

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({ _id: id, quantity: qty - 1 })
            })

            const responseData = await response.json()
            if (responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({ _id: id })
        })

        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
            toast.success("Item removed from cart")
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    const handlePayment = async () => {
        try {
            const response = await fetch(SummaryApi.createCheckoutSession.url, {
                method: SummaryApi.createCheckoutSession.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                }
            })

            const responseData = await response.json()

            if (responseData.success && responseData.sessionUrl) {
                window.location.href = responseData.sessionUrl
            } else {
                toast.error(responseData.message || 'Failed to initiate payment')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
            console.error('Payment error:', error)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='min-h-screen bg-slate-50 pb-20'
        >
            {/* Header Banner */}
            <div className='relative h-40 lg:h-56 premium-gradient overflow-hidden flex items-center justify-center'>
                <div className='absolute inset-0 bg-black opacity-10'></div>
                <div className='relative z-10 text-center'>
                    <h1 className='text-4xl lg:text-5xl font-bold text-white tracking-tight'>Secure Checkout</h1>
                    <p className='text-white/80 mt-2 font-medium uppercase tracking-[0.2em] text-xs'>Your premium shopping experience</p>
                </div>
                <div className='absolute -bottom-12 left-0 right-0 h-24 bg-slate-50 skew-y-2 origin-bottom-right transform scale-110'></div>
            </div>

            <div className='container mx-auto px-4 max-w-6xl -mt-12 relative z-10'>
                
                {/* Steps Indicator */}
                <div className='flex items-center justify-center mb-12'>
                    <div className='glass rounded-2xl p-4 flex items-center gap-4 lg:gap-8 shadow-xl border-white border-opacity-50'>
                        <div className='flex items-center gap-2 text-indigo-600'>
                            <div className='w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white text-sm font-bold'>1</div>
                            <span className='font-bold text-sm hidden sm:block'>Review</span>
                        </div>
                        <div className='h-[2px] w-8 lg:w-16 bg-slate-200'></div>
                        <div className='flex items-center gap-2 text-slate-400'>
                            <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold'>2</div>
                            <span className='font-bold text-sm hidden sm:block'>Shipping</span>
                        </div>
                        <div className='h-[2px] w-8 lg:w-16 bg-slate-200'></div>
                        <div className='flex items-center gap-2 text-slate-400'>
                            <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold'>3</div>
                            <span className='font-bold text-sm hidden sm:block'>Payment</span>
                        </div>
                    </div>
                </div>

                {data.length === 0 && !loading ? (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='glass rounded-3xl p-20 text-center shadow-2xl'
                    >
                        <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner'>
                            <MdShoppingCart className='text-slate-300 text-5xl' />
                        </div>
                        <h2 className='text-3xl font-bold text-slate-800 tracking-tight'>Your cart is empty</h2>
                        <p className='text-slate-500 mt-2 font-medium'>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className='mt-8 inline-flex items-center gap-2 premium-gradient text-white px-8 py-3 rounded-2xl font-bold hover:shadow-2xl transition-all'>
                            Start Shopping <MdArrowForward />
                        </Link>
                    </motion.div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                        
                        {/* Left Column - Cart Items */}
                        <div className='lg:col-span-8 space-y-4'>
                            <AnimatePresence mode='popLayout'>
                                {loading ? (
                                    loadingCart.map((_, index) => (
                                        <div key={"loading"+index} className='w-full glass h-32 rounded-3xl animate-pulse'></div>
                                    ))
                                ) : (
                                    data.map((product, index) => (
                                        <motion.div 
                                            key={product?._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.1 }}
                                            className='glass rounded-3xl p-4 flex items-center gap-6 shadow-xl hover:shadow-2xl transition-all group'
                                        >
                                            <div className='w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl p-2 shadow-inner group-hover:scale-105 transition-transform'>
                                                <img 
                                                    src={product?.productId?.productImage[0]} 
                                                    className='w-full h-full object-scale-down mix-blend-multiply' 
                                                    alt={product?.productId?.productName}
                                                />
                                            </div>

                                            <div className='flex-1 pr-8 relative'>
                                                <button 
                                                    className='absolute -top-1 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all'
                                                    onClick={() => deleteCartProduct(product?._id)}
                                                >
                                                    <MdDelete className='text-xl' />
                                                </button>

                                                <h2 className='text-lg lg:text-xl font-bold text-slate-800 line-clamp-1'>{product?.productId?.productName}</h2>
                                                <p className='text-indigo-500 font-bold text-xs uppercase tracking-widest mt-1'>{product?.productId.category}</p>
                                                
                                                <div className='flex items-center justify-between mt-4'>
                                                    <div className='space-y-1'>
                                                        <p className='text-slate-400 text-[10px] font-bold uppercase tracking-widest'>Unit Price</p>
                                                        <p className='text-slate-800 font-bold'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                    </div>
                                                    
                                                    <div className='flex items-center bg-slate-50/50 rounded-2xl p-1 border border-slate-100'>
                                                        <button 
                                                            className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm transition-all' 
                                                            onClick={() => decreaseQty(product?._id, product?.quantity)}
                                                        >-</button>
                                                        <span className='w-8 text-center font-bold text-slate-700'>{product?.quantity}</span>
                                                        <button 
                                                            className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm transition-all' 
                                                            onClick={() => increaseQty(product?._id, product?.quantity)}
                                                        >+</button>
                                                    </div>

                                                    <div className='text-right'>
                                                        <p className='text-slate-400 text-[10px] font-bold uppercase tracking-widest'>Subtotal</p>
                                                        <p className='text-indigo-600 font-black text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className='lg:col-span-4'>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className='glass rounded-3xl p-8 sticky top-24 shadow-2xl border-white border-opacity-40 overflow-hidden'
                            >
                                <div className='absolute top-0 right-0 w-24 h-24 premium-gradient opacity-10 rounded-bl-full'></div>
                                
                                <h2 className='text-2xl font-bold text-slate-800 tracking-tight mb-8 flex items-center gap-3'>
                                    <div className='w-8 h-8 premium-gradient rounded-lg flex items-center justify-center text-white shadow-lg'>
                                        <MdShoppingCart className='text-sm' />
                                    </div>
                                    Order Summary
                                </h2>

                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between text-slate-500 font-medium'>
                                        <p>Items ({totalQty})</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>
                                    </div>
                                    <div className='flex items-center justify-between text-slate-500 font-medium'>
                                        <p>Shipping</p>
                                        <p className='text-emerald-500'>FREE</p>
                                    </div>
                                    <div className='flex items-center justify-between text-slate-500 font-medium'>
                                        <p>Tax Estimate</p>
                                        <p>{displayINRCurrency(totalPrice * 0.18)}</p>
                                    </div>
                                    
                                    <div className='pt-6 mt-6 border-t border-slate-100 flex items-center justify-between'>
                                        <div>
                                            <p className='text-slate-400 text-xs font-bold uppercase tracking-widest'>Total Amount</p>
                                            <p className='text-3xl font-black text-slate-800 tracking-tighter'>{displayINRCurrency(totalPrice + (totalPrice * 0.18))}</p>
                                        </div>
                                    </div>

                                    <div className='space-y-3 pt-8'>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className='w-full premium-gradient text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-3'
                                            onClick={handlePayment}
                                        >
                                            <MdPayment className='text-xl' />
                                            Continue to Payment
                                        </motion.button>
                                        <p className='text-[10px] text-slate-400 text-center font-bold uppercase tracking-[0.1em]'>Secure 256-bit SSL Encrypted Payment</p>
                                    </div>

                                    <div className='mt-8 pt-8 border-t border-slate-100 flex items-center gap-4 text-slate-400 text-xs'>
                                        <div className='flex items-center gap-1 font-bold'>
                                            <MdLocalShipping /> Express
                                        </div>
                                        <div className='flex items-center gap-1 font-bold'>
                                            <MdPayment /> Secure
                                        </div>
                                        <div className='flex items-center gap-1 font-bold'>
                                            🛡️ Protection
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default Cart