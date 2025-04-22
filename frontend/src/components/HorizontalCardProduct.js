// import React, { useContext, useEffect, useRef, useState } from 'react'
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
// import displayINRCurrency from '../helpers/displayCurrency'
// import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'
// import addToCart from '../helpers/addToCart'
// import Context from '../context'

// const HorizontalCardProduct = ({category, heading}) => {
//     const [data,setData] = useState([])
//     const [loading,setLoading] = useState(true)
//     const loadingList = new Array(13).fill(null)

//     const [scroll,setScroll] = useState(0)
//     const scrollElement = useRef()


//     const { fetchUserAddToCart } = useContext(Context)

//     const handleAddToCart = async(e,id)=>{
//        await addToCart(e,id)
//        fetchUserAddToCart()
//     }

//     const fetchData = async() =>{
//         setLoading(true)
//         const categoryProduct = await fetchCategoryWiseProduct(category)
//         setLoading(false)

//         console.log("horizontal data",categoryProduct.data)
//         setData(categoryProduct?.data)
//     }

//     useEffect(()=>{
//         fetchData()
//     },[])

//     const scrollRight = () =>{
//         scrollElement.current.scrollLeft += 300
//     }
//     const scrollLeft = () =>{
//         scrollElement.current.scrollLeft -= 300
//     }


//   return (
//     <div className='container mx-auto px-4 my-6 relative'>

//             <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                
//            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>

//             <button  className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}><FaAngleLeft/></button>
//             <button  className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}><FaAngleRight/></button> 

//            {   loading ? (
//                 loadingList.map((product,index)=>{
//                     return(
//                         <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
//                             <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'>

//                             </div>
//                             <div className='p-4 grid w-full gap-2'>
//                                 <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'></h2>
//                                 <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
//                                 <div className='flex gap-3 w-full'>
//                                     <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
//                                     <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
//                                 </div>
//                                 <button className='text-sm  text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse'></button>
//                             </div>
//                         </div>
//                     )
//                 })
//            ) : (
//             data.map((product,index)=>{
//                 return(
//                     <Link to={"product/"+product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
//                         <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
//                             <img src={product.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
//                         </div>
//                         <div className='p-4 grid'>
//                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
//                             <p className='capitalize text-slate-500'>{product?.category}</p>
//                             <div className='flex gap-3'>
//                                 <p className='text-red-600 font-medium'>{ displayINRCurrency(product?.sellingPrice) }</p>
//                                 <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price)  }</p>
//                             </div>
//                             <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
//                         </div>
//                     </Link>
//                 )
//             })
//            )
               
//             }
//            </div>
            

//     </div>
//   )
// }

// export default HorizontalCardProduct

// import React, { useContext, useEffect, useRef, useState } from 'react'
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
// import displayINRCurrency from '../helpers/displayCurrency'
// import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'
// import addToCart from '../helpers/addToCart'
// import Context from '../context'
// import { motion, AnimatePresence } from 'framer-motion'

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// }

// const itemVariants = {
//   hidden: { opacity: 0, x: 50 },
//   visible: { opacity: 1, x: 0 },
// }

// const bgColors = ['bg-pink-100', 'bg-purple-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100']
// const borderColors = ['border-pink-300', 'border-purple-300', 'border-blue-300', 'border-green-300', 'border-yellow-300']

// const HorizontalCardProduct = ({ category, heading }) => {
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const loadingList = new Array(6).fill(null)

//   const scrollElement = useRef()
//   const { fetchUserAddToCart } = useContext(Context)

//   const handleAddToCart = async (e, id) => {
//     e.preventDefault()
//     await addToCart(e, id)
//     fetchUserAddToCart()
//   }

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const categoryProduct = await fetchCategoryWiseProduct(category)
//       setData(categoryProduct?.data || [])
//     } catch (error) {
//       console.error('Error fetching products', error)
//     }
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchData()
//   }, [category])

//   const scrollRight = () => {
//     scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' })
//   }
//   const scrollLeft = () => {
//     scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' })
//   }

//   return (
//     <div className="container mx-auto px-4 my-6 relative">
//       <h2 className="text-2xl font-semibold py-4 text-gray-800">{heading}</h2>

//       <div className="relative">
//         <motion.button
//           className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hidden md:flex items-center justify-center z-10"
//           onClick={scrollLeft}
//           whileHover={{ scale: 1.1 }}
//         >
//           <FaAngleLeft />
//         </motion.button>
//         <motion.button
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hidden md:flex items-center justify-center z-10"
//           onClick={scrollRight}
//           whileHover={{ scale: 1.1 }}
//         >
//           <FaAngleRight />
//         </motion.button>

//         <motion.div
//           className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none"
//           ref={scrollElement}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <AnimatePresence>
//             {loading
//               ? loadingList.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className={`${bgColors[index % bgColors.length]} w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 rounded-sm shadow flex`}
//                     variants={itemVariants}
//                     exit={{ opacity: 0 }}
//                   >
//                     <div className="bg-white h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse"></div>
//                     <div className="p-4 grid w-full gap-2">
//                       <div className="h-4 bg-white animate-pulse rounded"></div>
//                       <div className="h-3 bg-white animate-pulse rounded w-1/2"></div>
//                       <div className="flex gap-3 w-full">
//                         <div className="h-4 bg-white animate-pulse rounded w-1/3"></div>
//                         <div className="h-4 bg-white animate-pulse rounded w-1/4"></div>
//                       </div>
//                       <div className="h-6 bg-white animate-pulse rounded w-full"></div>
//                     </div>
//                   </motion.div>
//                 ))
//               : data.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36"
//                     variants={itemVariants}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link
//                       to={`/product/${product._id}`}
//                       className={`bg-white rounded-sm shadow flex h-full overflow-hidden border-4 ${borderColors[index % borderColors.length]}`}
//                     >
//                       <div className="h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center">
//                         <motion.img
//                           src={product.productImage[0]}
//                           className="object-contain h-full"
//                           whileHover={{ scale: 1.1 }}
//                           transition={{ type: 'spring', stiffness: 300 }}
//                         />
//                       </div>
//                       <div className="p-4 grid flex-1 gap-1">
//                         <h2 className="font-medium text-base md:text-lg line-clamp-1 text-gray-800">
//                           {product.productName}
//                         </h2>
//                         <p className="capitalize text-gray-600">
//                           {product.category}
//                         </p>
//                         <div className="flex gap-3">
//                           <p className="text-red-600 font-medium">
//                             {displayINRCurrency(product.sellingPrice)}
//                           </p>
//                           <p className="text-gray-500 line-through">
//                             {displayINRCurrency(product.price)}
//                           </p>
//                         </div>
//                         <motion.button
//                           className="text-sm bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white px-3 py-1 rounded-full self-start"
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           Add to Cart
//                         </motion.button>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default HorizontalCardProduct


// import React, { useContext, useEffect, useRef, useState } from 'react'
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
// import displayINRCurrency from '../helpers/displayCurrency'
// import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'
// import addToCart from '../helpers/addToCart'
// import Context from '../context'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useInView } from 'react-intersection-observer'

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// }

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// }

// const HorizontalCardProduct = ({ category, heading }) => {
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [visibleItemCount, setVisibleItemCount] = useState(0)
//   const [wishlist, setWishlist] = useState({})
//   const [quickViewProduct, setQuickViewProduct] = useState(null)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const loadingList = new Array(6).fill(null)

//   const scrollElement = useRef()
//   const { fetchUserAddToCart } = useContext(Context)
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   })

//   const handleAddToCart = async (e, id) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     const button = e.currentTarget
//     button.classList.add('animate-pulse')
//     button.innerText = 'Adding...'
    
//     await addToCart(e, id)
//     fetchUserAddToCart()
    
//     button.classList.remove('animate-pulse')
//     button.innerText = 'Added ✓'
    
//     setTimeout(() => {
//       button.innerText = 'Add to Cart'
//     }, 2000)
//   }

//   const toggleWishlist = (e, id) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setWishlist(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }))
    
//     // Animation feedback
//     const icon = e.currentTarget
//     icon.classList.add('scale-125')
//     setTimeout(() => {
//       icon.classList.remove('scale-125')
//     }, 300)
//   }

//   const openQuickView = (e, product) => {
//     e.preventDefault()
//     setQuickViewProduct(product)
//   }

//   const closeQuickView = () => {
//     setQuickViewProduct(null)
//   }

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const categoryProduct = await fetchCategoryWiseProduct(category)
//       setData(categoryProduct?.data || [])
      
//       // Calculate visible items based on screen width
//       const containerWidth = scrollElement.current?.clientWidth || 0
//       const itemWidth = window.innerWidth >= 768 ? 320 : 280
//       setVisibleItemCount(Math.floor(containerWidth / itemWidth))
//     } catch (error) {
//       console.error('Error fetching products', error)
//     }
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchData()
    
//     const handleResize = () => {
//       if (scrollElement.current) {
//         const containerWidth = scrollElement.current.clientWidth
//         const itemWidth = window.innerWidth >= 768 ? 320 : 280
//         setVisibleItemCount(Math.floor(containerWidth / itemWidth))
//       }
//     }
    
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [category])

//   const scrollRight = () => {
//     if (activeIndex < data.length - visibleItemCount) {
//       setActiveIndex(prev => prev + 1)
//       scrollElement.current.scrollBy({ left: 320, behavior: 'smooth' })
//     } else {
//       // Loop back to start with animation
//       setActiveIndex(0)
//       scrollElement.current.scrollTo({ left: 0, behavior: 'smooth' })
//     }
//   }
  
//   const scrollLeft = () => {
//     if (activeIndex > 0) {
//       setActiveIndex(prev => prev - 1)
//       scrollElement.current.scrollBy({ left: -320, behavior: 'smooth' })
//     } else {
//       // Loop to end
//       setActiveIndex(data.length - visibleItemCount)
//       scrollElement.current.scrollTo({ 
//         left: scrollElement.current.scrollWidth, 
//         behavior: 'smooth' 
//       })
//     }
//   }

//   // Auto-scroll functionality
//   useEffect(() => {
//     let interval
    
//     if (inView && data.length > visibleItemCount) {
//       interval = setInterval(() => {
//         scrollRight()
//       }, 5000)
//     }
    
//     return () => clearInterval(interval)
//   }, [inView, data.length, visibleItemCount, activeIndex])

//   return (
//     <div className="container mx-auto px-4 my-6 relative" ref={ref}>
//       <div className="flex justify-between items-center py-4">
//         <h2 className="text-2xl font-semibold">{heading}</h2>
//         <div className="flex gap-2">
//           <motion.button
//             className="bg-white shadow-md rounded-full p-2 flex items-center justify-center"
//             onClick={scrollLeft}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaAngleLeft />
//           </motion.button>
//           <motion.button
//             className="bg-white shadow-md rounded-full p-2 flex items-center justify-center"
//             onClick={scrollRight}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaAngleRight />
//           </motion.button>
//         </div>
//       </div>

//       <div className="relative">
//         <motion.div
//           className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none pb-4"
//           ref={scrollElement}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           variants={containerVariants}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <AnimatePresence>
//             {loading
//               ? loadingList.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-48 bg-white rounded-lg shadow flex flex-col"
//                     variants={itemVariants}
//                     exit={{ opacity: 0 }}
//                   >
//                     <div className="bg-slate-200 h-28 p-4 w-full animate-pulse rounded-t-lg"></div>
//                     <div className="p-4 grid w-full gap-2">
//                       <div className="h-4 bg-slate-200 animate-pulse rounded"></div>
//                       <div className="h-3 bg-slate-200 animate-pulse rounded w-1/2"></div>
//                       <div className="flex gap-3 w-full">
//                         <div className="h-4 bg-slate-200 animate-pulse rounded w-1/3"></div>
//                         <div className="h-4 bg-slate-200 animate-pulse rounded w-1/4"></div>
//                       </div>
//                       <div className="h-8 bg-slate-200 animate-pulse rounded w-full"></div>
//                     </div>
//                   </motion.div>
//                 ))
//               : data.map((product) => (
//                   <motion.div
//                     key={product._id}
//                     className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px]"
//                     variants={itemVariants}
//                     whileHover={{ y: -5 }}
//                   >
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
//                       <div className="relative bg-slate-100 p-3 h-44 flex items-center justify-center">
//                         <motion.button
//                           className="absolute top-2 right-2 bg-white rounded-full p-2 z-10 transition-transform"
//                           onClick={(e) => toggleWishlist(e, product._id)}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                         >
//                           {wishlist[product._id] ? 
//                             <FaHeart className="text-red-500" /> : 
//                             <FaRegHeart />
//                           }
//                         </motion.button>
                        
//                         <Link to={`/product/${product._id}`}>
//                           <motion.img
//                             src={product.productImage[0]}
//                             className="object-contain h-36 w-full"
//                             whileHover={{ scale: 1.15 }}
//                             transition={{ type: 'spring', stiffness: 300 }}
//                           />
//                         </Link>
                        
//                         <motion.button
//                           className="absolute bottom-2 opacity-0 group-hover:opacity-100 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm"
//                           onClick={(e) => openQuickView(e, product)}
//                           whileHover={{ scale: 1.05 }}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 0 }}
//                           whileInView={{ opacity: 1 }}
//                         >
//                           Quick View
//                         </motion.button>
//                       </div>
                      
//                       <div className="p-4 flex flex-col flex-1">
//                         <Link to={`/product/${product._id}`} className="flex-1">
//                           <h2 className="font-medium text-base md:text-lg line-clamp-1 hover:text-red-600 transition-colors">
//                             {product.productName}
//                           </h2>
//                           <p className="capitalize text-slate-500 text-sm">
//                             {product.category}
//                           </p>
//                           <div className="flex items-center gap-1 mt-1 mb-2">
//                             {[...Array(5)].map((_, i) => (
//                               <FaStar 
//                                 key={i} 
//                                 className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-300"} 
//                                 size={12}
//                               />
//                             ))}
//                             <span className="text-xs text-gray-500 ml-1">
//                               ({Math.floor(Math.random() * 200) + 10})
//                             </span>
//                           </div>
//                         </Link>
                        
//                         <div className="flex justify-between items-center mt-2">
//                           <div>
//                             <span className="text-red-600 font-medium">
//                               {displayINRCurrency(product.sellingPrice)}
//                             </span>
//                             <span className="text-slate-500 line-through text-sm ml-2">
//                               {displayINRCurrency(product.price)}
//                             </span>
//                           </div>
//                           <div className="text-green-600 text-xs font-medium">
//                             {Math.round((product.price - product.sellingPrice) / product.price * 100)}% off
//                           </div>
//                         </div>
                        
//                         <motion.button
//                           className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md w-full transition-colors relative"
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           Add to Cart
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//           </AnimatePresence>
//         </motion.div>
//       </div>
      
//       {/* Pagination dots for mobile */}
//       {!loading && data.length > visibleItemCount && (
//         <div className="flex justify-center mt-4 gap-2">
//           {Array.from({ length: Math.ceil(data.length / visibleItemCount) }).map((_, index) => (
//             <button
//               key={index}
//               className={`h-2 rounded-full transition-all ${
//                 Math.floor(activeIndex / visibleItemCount) === index 
//                   ? "w-6 bg-red-600" 
//                   : "w-2 bg-gray-300"
//               }`}
//               onClick={() => {
//                 setActiveIndex(index * visibleItemCount)
//                 scrollElement.current.scrollTo({ 
//                   left: index * visibleItemCount * 320, 
//                   behavior: 'smooth' 
//                 })
//               }}
//             />
//           ))}
//         </div>
//       )}
      
//       {/* Quick View Modal */}
//       <AnimatePresence>
//         {quickViewProduct && (
//           <motion.div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeQuickView}
//           >
//             <motion.div 
//               className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-start p-4 border-b">
//                 <h3 className="text-xl font-semibold flex-1">{quickViewProduct.productName}</h3>
//                 <button 
//                   className="text-gray-500 hover:text-gray-700"
//                   onClick={closeQuickView}
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">
//                 <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
//                   <img 
//                     src={quickViewProduct.productImage[0]} 
//                     alt={quickViewProduct.productName}
//                     className="max-h-64 object-contain"
//                   />
//                 </div>
                
//                 <div>
//                   <p className="capitalize text-slate-500 mb-2">{quickViewProduct.category}</p>
                  
//                   <div className="flex items-center gap-1 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar 
//                         key={i} 
//                         className={i < (quickViewProduct.rating || 4) ? "text-yellow-400" : "text-gray-300"} 
//                       />
//                     ))}
//                     <span className="text-sm text-gray-500 ml-1">
//                       ({Math.floor(Math.random() * 200) + 10} reviews)
//                     </span>
//                   </div>
                  
//                   <div className="flex items-baseline gap-3 mb-3">
//                     <span className="text-xl text-red-600 font-semibold">
//                       {displayINRCurrency(quickViewProduct.sellingPrice)}
//                     </span>
//                     <span className="text-slate-500 line-through">
//                       {displayINRCurrency(quickViewProduct.price)}
//                     </span>
//                     <span className="text-green-600 text-sm font-medium">
//                       {Math.round((quickViewProduct.price - quickViewProduct.sellingPrice) / quickViewProduct.price * 100)}% off
//                     </span>
//                   </div>
                  
//                   <p className="text-gray-600 mb-4">
//                     {quickViewProduct.description || "Premium quality product with fast shipping. Limited stock available, grab yours now!"}
//                   </p>
                  
//                   <div className="flex gap-2 mb-4">
//                     <div className="border border-gray-300 rounded-full px-3 py-1 text-sm">In Stock</div>
//                     <div className="border border-green-300 bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">Fast Delivery</div>
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <motion.button
//                       className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
//                       onClick={(e) => {
//                         handleAddToCart(e, quickViewProduct._id)
//                         setTimeout(closeQuickView, 2000)
//                       }}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       Add to Cart
//                     </motion.button>
                    
//                     <Link 
//                       to={`/product/${quickViewProduct._id}`}
//                       className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default HorizontalCardProduct


// import React, { useContext, useEffect, useRef, useState } from 'react'
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
// import displayINRCurrency from '../helpers/displayCurrency'
// import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'
// import addToCart from '../helpers/addToCart'
// import Context from '../context'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useInView } from 'react-intersection-observer'

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// }

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// }

// // Array of gradient borders to cycle through
// const gradientBorders = [
//   'border-gradient-purple',
//   'border-gradient-blue',
//   'border-gradient-green',
//   'border-gradient-yellow',
//   'border-gradient-orange',
//   'border-gradient-red',
// ]

// const HorizontalCardProduct = ({ category, heading }) => {
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [visibleItemCount, setVisibleItemCount] = useState(0)
//   const [wishlist, setWishlist] = useState({})
//   const [quickViewProduct, setQuickViewProduct] = useState(null)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const loadingList = new Array(6).fill(null)

//   const scrollElement = useRef()
//   const { fetchUserAddToCart } = useContext(Context)
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   })

//   // Function to get border color for an item based on its index
//   const getBorderStyle = (index) => {
//     const borderClass = gradientBorders[index % gradientBorders.length]
//     return borderClass
//   }

//   const handleAddToCart = async (e, id) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     const button = e.currentTarget
//     button.classList.add('animate-pulse')
//     button.innerText = 'Adding...'
    
//     await addToCart(e, id)
//     fetchUserAddToCart()
    
//     button.classList.remove('animate-pulse')
//     button.innerText = 'Added ✓'
    
//     setTimeout(() => {
//       button.innerText = 'Add to Cart'
//     }, 2000)
//   }

//   const toggleWishlist = (e, id) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setWishlist(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }))
    
//     // Animation feedback
//     const icon = e.currentTarget
//     icon.classList.add('scale-125')
//     setTimeout(() => {
//       icon.classList.remove('scale-125')
//     }, 300)
//   }

//   const openQuickView = (e, product) => {
//     e.preventDefault()
//     setQuickViewProduct(product)
//   }

//   const closeQuickView = () => {
//     setQuickViewProduct(null)
//   }

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const categoryProduct = await fetchCategoryWiseProduct(category)
//       setData(categoryProduct?.data || [])
      
//       // Calculate visible items based on screen width
//       const containerWidth = scrollElement.current?.clientWidth || 0
//       const itemWidth = window.innerWidth >= 768 ? 320 : 280
//       setVisibleItemCount(Math.floor(containerWidth / itemWidth))
//     } catch (error) {
//       console.error('Error fetching products', error)
//     }
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchData()
    
//     const handleResize = () => {
//       if (scrollElement.current) {
//         const containerWidth = scrollElement.current.clientWidth
//         const itemWidth = window.innerWidth >= 768 ? 320 : 280
//         setVisibleItemCount(Math.floor(containerWidth / itemWidth))
//       }
//     }
    
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [category])

//   const scrollRight = () => {
//     if (activeIndex < data.length - visibleItemCount) {
//       setActiveIndex(prev => prev + 1)
//       scrollElement.current.scrollBy({ left: 320, behavior: 'smooth' })
//     } else {
//       // Loop back to start with animation
//       setActiveIndex(0)
//       scrollElement.current.scrollTo({ left: 0, behavior: 'smooth' })
//     }
//   }
  
//   const scrollLeft = () => {
//     if (activeIndex > 0) {
//       setActiveIndex(prev => prev - 1)
//       scrollElement.current.scrollBy({ left: -320, behavior: 'smooth' })
//     } else {
//       // Loop to end
//       setActiveIndex(data.length - visibleItemCount)
//       scrollElement.current.scrollTo({ 
//         left: scrollElement.current.scrollWidth, 
//         behavior: 'smooth' 
//       })
//     }
//   }

//   // Auto-scroll functionality
//   useEffect(() => {
//     let interval
    
//     if (inView && data.length > visibleItemCount) {
//       interval = setInterval(() => {
//         scrollRight()
//       }, 5000)
//     }
    
//     return () => clearInterval(interval)
//   }, [inView, data.length, visibleItemCount, activeIndex])

//   // Add CSS for gradient borders
//   useEffect(() => {
//     const style = document.createElement('style')
//     style.innerHTML = `
//       .border-gradient-purple {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #da22ff 0%, #9733ee 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       .border-gradient-blue {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       .border-gradient-green {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       .border-gradient-yellow {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #F2994A 0%, #F2C94C 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       .border-gradient-orange {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #FF416C 0%, #FF9E80 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       .border-gradient-red {
//         border: 4px solid transparent;
//         border-radius: 0.5rem;
//         background-image: linear-gradient(white, white), 
//                           linear-gradient(135deg, #FF057C 0%, #8D0B93 100%);
//         background-origin: border-box;
//         background-clip: content-box, border-box;
//         position: relative;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//         transition: all 0.3s ease;
//       }
      
//       /* Hover effect for all gradient borders */
//       [class^="border-gradient-"]:hover {
//         transform: translateY(-5px);
//         box-shadow: 0 10px 20px rgba(0,0,0,0.12);
//       }
      
//       /* Pulse animation for new products */
//       @keyframes borderPulse {
//         0% { box-shadow: 0 0 0 0 rgba(255,105,180,0.7); }
//         70% { box-shadow: 0 0 0 10px rgba(255,105,180,0); }
//         100% { box-shadow: 0 0 0 0 rgba(255,105,180,0); }
//       }
      
//       .pulse-border {
//         animation: borderPulse 2s infinite;
//       }
      
//       /* Rainbow loading skeleton */
//       @keyframes gradientMove {
//         0% { background-position: 0% 50%; }
//         50% { background-position: 100% 50%; }
//         100% { background-position: 0% 50%; }
//       }
      
//       .gradient-loading {
//         background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
//         background-size: 200% 200%;
//         animation: gradientMove 1.5s ease-in-out infinite;
//       }
//     `
//     document.head.appendChild(style)
    
//     return () => {
//       document.head.removeChild(style)
//     }
//   }, [])

//   return (
//     <div className="container mx-auto px-4 my-6 relative" ref={ref}>
//       <div className="flex justify-between items-center py-4">
//         <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">{heading}</h2>
//         <div className="flex gap-2">
//           <motion.button
//             className="bg-white shadow-md rounded-full p-2 flex items-center justify-center border border-gray-200"
//             onClick={scrollLeft}
//             whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaAngleLeft className="text-gray-600" />
//           </motion.button>
//           <motion.button
//             className="bg-white shadow-md rounded-full p-2 flex items-center justify-center border border-gray-200"
//             onClick={scrollRight}
//             whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaAngleRight className="text-gray-600" />
//           </motion.button>
//         </div>
//       </div>

//       <div className="relative">
//         <motion.div
//           className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none pb-6"
//           ref={scrollElement}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           variants={containerVariants}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <AnimatePresence>
//             {loading
//               ? loadingList.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className={`w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-48 rounded-lg gradient-loading`}
//                     variants={itemVariants}
//                     exit={{ opacity: 0 }}
//                   >
//                     <div className="h-full p-4 w-full rounded-lg"></div>
//                   </motion.div>
//                 ))
//               : data.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     className={`w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] ${getBorderStyle(index)} ${index < 2 ? 'pulse-border' : ''}`}
//                     variants={itemVariants}
//                   >
//                     <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
//                       <div className="relative bg-slate-100 p-3 h-44 flex items-center justify-center">
//                         {index < 2 && (
//                           <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
//                             NEW
//                           </div>
//                         )}
                        
//                         <motion.button
//                           className="absolute top-2 right-2 bg-white rounded-full p-2 z-10 transition-transform"
//                           onClick={(e) => toggleWishlist(e, product._id)}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                         >
//                           {wishlist[product._id] ? 
//                             <FaHeart className="text-red-500" /> : 
//                             <FaRegHeart />
//                           }
//                         </motion.button>
                        
//                         <Link to={`/product/${product._id}`}>
//                           <motion.img
//                             src={product.productImage[0]}
//                             className="object-contain h-36 w-full"
//                             whileHover={{ scale: 1.15 }}
//                             transition={{ type: 'spring', stiffness: 300 }}
//                           />
//                         </Link>
                        
//                         <motion.button
//                           className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm"
//                           onClick={(e) => openQuickView(e, product)}
//                           whileHover={{ scale: 1.05 }}
//                           initial={{ opacity: 0 }}
//                           whileInView={{ opacity: 0.9 }}
//                         >
//                           Quick View
//                         </motion.button>
//                       </div>
                      
//                       <div className="p-4 flex flex-col flex-1">
//                         <Link to={`/product/${product._id}`} className="flex-1">
//                           <h2 className="font-medium text-base md:text-lg line-clamp-1 hover:text-red-600 transition-colors">
//                             {product.productName}
//                           </h2>
//                           <p className="capitalize text-slate-500 text-sm">
//                             {product.category}
//                           </p>
//                           <div className="flex items-center gap-1 mt-1 mb-2">
//                             {[...Array(5)].map((_, i) => (
//                               <FaStar 
//                                 key={i} 
//                                 className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-300"} 
//                                 size={12}
//                               />
//                             ))}
//                             <span className="text-xs text-gray-500 ml-1">
//                               ({Math.floor(Math.random() * 200) + 10})
//                             </span>
//                           </div>
//                         </Link>
                        
//                         <div className="flex justify-between items-center mt-2">
//                           <div>
//                             <span className="text-red-600 font-medium">
//                               {displayINRCurrency(product.sellingPrice)}
//                             </span>
//                             <span className="text-slate-500 line-through text-sm ml-2">
//                               {displayINRCurrency(product.price)}
//                             </span>
//                           </div>
//                           <div className="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
//                             {Math.round((product.price - product.sellingPrice) / product.price * 100)}% off
//                           </div>
//                         </div>
                        
//                         <motion.button
//                           className={`mt-3 text-sm text-white px-3 py-2 rounded-md w-full relative bg-gradient-to-r ${index % 2 === 0 ? 'from-purple-600 to-blue-500' : 'from-pink-500 to-red-500'}`}
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           Add to Cart
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//           </AnimatePresence>
//         </motion.div>
//       </div>
      
//       {/* Pagination dots for mobile */}
//       {!loading && data.length > visibleItemCount && (
//         <div className="flex justify-center mt-2 gap-2">
//           {Array?.from({ length: Math.ceil(data.length / visibleItemCount) }).map((_, index) => (
//             <button
//               key={index}
//               className={`h-2 rounded-full transition-all ${
//                 Math.floor(activeIndex / visibleItemCount) === index 
//                   ? "w-6 bg-gradient-to-r from-purple-600 to-pink-500" 
//                   : "w-2 bg-gray-300"
//               }`}
//               onClick={() => {
//                 setActiveIndex(index * visibleItemCount)
//                 scrollElement.current.scrollTo({ 
//                   left: index * visibleItemCount * 320, 
//                   behavior: 'smooth' 
//                 })
//               }}
//             />
//           ))}
//         </div>
//       )}
      
//       {/* Quick View Modal */}
//       <AnimatePresence>
//         {quickViewProduct && (
//           <motion.div 
//             className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeQuickView}
//           >
//             <motion.div 
//               className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-transparent"
//               style={{
//                 backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #ef4444 100%)',
//                 backgroundOrigin: 'border-box',
//                 backgroundClip: 'content-box, border-box'
//               }}
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-start p-4 border-b">
//                 <h3 className="text-xl font-semibold flex-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
//                   {quickViewProduct?.productName}
//                 </h3>
//                 <button 
//                   className="text-gray-500 hover:text-gray-700"
//                   onClick={closeQuickView}
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">
//                 <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
//                   <img 
//                     src={quickViewProduct.productImage[0]} 
//                     alt={quickViewProduct.productName}
//                     className="max-h-64 object-contain"
//                   />
//                 </div>
                
//                 <div>
//                   <p className="capitalize text-slate-500 mb-2">{quickViewProduct.category}</p>
                  
//                   <div className="flex items-center gap-1 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar 
//                         key={i} 
//                         className={i < (quickViewProduct.rating || 4) ? "text-yellow-400" : "text-gray-300"} 
//                       />
//                     ))}
//                     <span className="text-sm text-gray-500 ml-1">
//                       ({Math.floor(Math.random() * 200) + 10} reviews)
//                     </span>
//                   </div>
                  
//                   <div className="flex items-baseline gap-3 mb-3">
//                     <span className="text-xl text-red-600 font-semibold">
//                       {displayINRCurrency(quickViewProduct.sellingPrice)}
//                     </span>
//                     <span className="text-slate-500 line-through">
//                       {displayINRCurrency(quickViewProduct.price)}
//                     </span>
//                     <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
//                       {Math.round((quickViewProduct.price - quickViewProduct.sellingPrice) / quickViewProduct.price * 100)}% off
//                     </span>
//                   </div>
                  
//                   <p className="text-gray-600 mb-4">
//                     {quickViewProduct.description || "Premium quality product with fast shipping. Limited stock available, grab yours now!"}
//                   </p>
                  
//                   <div className="flex gap-2 mb-4">
//                     <div className="border border-gray-300 rounded-full px-3 py-1 text-sm">In Stock</div>
//                     <div className="border border-green-300 bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">Fast Delivery</div>
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <motion.button
//                       className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-md"
//                       onClick={(e) => {
//                         handleAddToCart(e, quickViewProduct._id)
//                         setTimeout(closeQuickView, 2000)
//                       }}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       Add to Cart
//                     </motion.button>
                    
//                     <Link 
//                       to={`/product/${quickViewProduct._id}`}
//                       className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default HorizontalCardProduct

import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const gradientBorders = [
  'border-gradient-purple',
  'border-gradient-blue',
  'border-gradient-green',
  'border-gradient-yellow',
  'border-gradient-orange',
  'border-gradient-red',
]

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleItemCount, setVisibleItemCount] = useState(1)
  const [wishlist, setWishlist] = useState({})
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const loadingList = new Array(6).fill(null)
  const [isTouch, setIsTouch] = useState(false)
  const scrollElement = useRef()
  const { fetchUserAddToCart } = useContext(Context)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Safely compute total pages
  const totalPages =
    visibleItemCount > 0 ? Math.ceil(data.length / visibleItemCount) : 0


    useEffect(() => {
      setIsTouch(
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      )
    }, [])
  const getBorderStyle = (index) =>
    gradientBorders[index % gradientBorders.length]

  const handleAddToCart = async (e, id) => {
    e.preventDefault(); e.stopPropagation()
    const btn = e.currentTarget
    btn.classList.add('animate-pulse')
    btn.innerText = 'Adding...'
    await addToCart(e, id)
    fetchUserAddToCart()
    btn.classList.remove('animate-pulse')
    btn.innerText = 'Added ✓'
    setTimeout(() => (btn.innerText = 'Add to Cart'), 2000)
  }

  const toggleWishlist = (e, id) => {
    e.preventDefault(); e.stopPropagation()
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }))
    const icon = e.currentTarget
    icon.classList.add('scale-125')
    setTimeout(() => icon.classList.remove('scale-125'), 300)
  }

  const openQuickView = (e, product) => {
    e.preventDefault()
    setQuickViewProduct(product)
  }
  const closeQuickView = () => setQuickViewProduct(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetchCategoryWiseProduct(category)
      const products = res?.data || []
      setData(products)

      const containerWidth = scrollElement.current?.clientWidth || 0
      const itemWidth = window.innerWidth >= 768 ? 320 : 280
      const count = Math.floor(containerWidth / itemWidth)
      setVisibleItemCount(count > 0 ? count : 1)
    } catch (err) {
      console.error('Error fetching products', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const onResize = () => {
      if (scrollElement.current) {
        const w = scrollElement.current.clientWidth
        const itemW = window.innerWidth >= 768 ? 320 : 280
        const c = Math.floor(w / itemW)
        setVisibleItemCount(c > 0 ? c : 1)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [category])

  const scrollRight = () => {
    if (activeIndex < data.length - visibleItemCount) {
      setActiveIndex(i => i + 1)
      scrollElement.current.scrollBy({ left: 320, behavior: 'smooth' })
    } else {
      setActiveIndex(0)
      scrollElement.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    if (activeIndex > 0) {
      setActiveIndex(i => i - 1)
      scrollElement.current.scrollBy({ left: -320, behavior: 'smooth' })
    } else {
      const last = data.length - visibleItemCount
      setActiveIndex(last)
      scrollElement.current.scrollTo({
        left: scrollElement.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }

  // Auto-scroll when in view
  useEffect(() => {
    let iv
    if (inView && data.length > visibleItemCount) {
      iv = setInterval(scrollRight, 5000)
    }
    return () => clearInterval(iv)
  }, [inView, data.length, visibleItemCount, activeIndex])

  // Inject gradient-border CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .border-gradient-purple {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #da22ff 0%, #9733ee 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      .border-gradient-blue {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      .border-gradient-green {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      .border-gradient-yellow {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #F2994A 0%, #F2C94C 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      .border-gradient-orange {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #FF416C 0%, #FF9E80 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      .border-gradient-red {
        border: 4px solid transparent; border-radius: .5rem;
        background-image: linear-gradient(white, white),
          linear-gradient(135deg, #FF057C 0%, #8D0B93 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all .3s ease;
      }
      [class^="border-gradient-"]:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.12);
      }
      @keyframes borderPulse {
        0% { box-shadow: 0 0 0 0 rgba(255,105,180,0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255,105,180,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,105,180,0); }
      }
      .pulse-border { animation: borderPulse 2s infinite; }
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .gradient-loading {
        background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
        background-size: 200% 200%;
        animation: gradientMove 1.5s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className="container mx-auto px-4 my-6 relative" ref={ref}>
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
          {heading}
        </h2>
        <div className="flex gap-2">
          <motion.button
            className="bg-white shadow-md rounded-full p-2 border border-gray-200"
            onClick={scrollLeft}
            whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaAngleLeft className="text-gray-600" />
          </motion.button>
          <motion.button
            className="bg-white shadow-md rounded-full p-2 border border-gray-200"
            onClick={scrollRight}
            whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaAngleRight className="text-gray-600" />
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <motion.div
          className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none pb-6"
          ref={scrollElement}
          // drag="x"
          drag={isTouch ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          // dragConstraints={{ left: 0, right: 0 }}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
          }}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <AnimatePresence>
            {loading
              ? loadingList.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-48 rounded-lg gradient-loading"
                    variants={itemVariants}
                    exit={{ opacity: 0 }}
                  />
                ))
              : data.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    className={`w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] ${getBorderStyle(
                      idx
                    )} ${idx < 2 ? 'pulse-border' : ''}`}
                    variants={itemVariants}
                  >
                    <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
                      <div className="relative bg-slate-100 p-3 h-44 flex items-center justify-center">
                        {idx < 2 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            NEW
                          </div>
                        )}
                        <motion.button
                          className="absolute top-2 right-2 bg-white rounded-full p-2 z-10"
                          onClick={e => toggleWishlist(e, product._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {wishlist[product._id] ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </motion.button>
                        <Link to={`/product/${product._id}`}>
                          <motion.img
                            src={product.productImage[0]}
                            className="object-contain h-36 w-full"
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          />
                        </Link>
                        <motion.button
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm"
                          onClick={e => openQuickView(e, product)}
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.9 }}
                        >
                          Quick View
                        </motion.button>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <Link to={`/product/${product._id}`} className="flex-1">
                          <h2 className="font-medium text-base md:text-lg line-clamp-1 hover:text-red-600 transition-colors">
                            {product.productName}
                          </h2>
                          <p className="capitalize text-slate-500 text-sm">
                            {product.category}
                          </p>
                          <div className="flex items-center gap-1 mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < (product.rating || 4)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }
                                size={12}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({Math.floor(Math.random() * 200) + 10})
                            </span>
                          </div>
                        </Link>

                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <span className="text-red-600 font-medium">
                              {displayINRCurrency(product.sellingPrice)}
                            </span>
                            <span className="text-slate-500 line-through text-sm ml-2">
                              {displayINRCurrency(product.price)}
                            </span>
                          </div>
                          <div className="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                            {Math.round(
                              ((product.price - product.sellingPrice) /
                                product.price) *
                                100
                            )}
                            % off
                          </div>
                        </div>

                        <motion.button
                          className={`mt-3 text-sm text-white px-3 py-2 rounded-md w-full relative bg-gradient-to-r ${
                            idx % 2 === 0
                              ? 'from-purple-600 to-blue-500'
                              : 'from-pink-500 to-red-500'
                          }`}
                          onClick={e => handleAddToCart(e, product._id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Pagination dots for mobile */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-2 gap-2">
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <button
              key={pageIdx}
              className={`h-2 rounded-full transition-all ${
                Math.floor(activeIndex / visibleItemCount) === pageIdx
                  ? 'w-6 bg-gradient-to-r from-purple-600 to-pink-500'
                  : 'w-2 bg-gray-300'
              }`}
              onClick={() => {
                const newIndex = pageIdx * visibleItemCount
                setActiveIndex(newIndex)
                scrollElement.current.scrollTo({
                  left: newIndex * 320,
                  behavior: 'smooth',
                })
              }}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #ef4444 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start p-4 border-b">
                <h3 className="text-xl font-semibold flex-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                  {quickViewProduct.productName}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeQuickView}
                >
                  ✕
                </button>
              </div>
              <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={quickViewProduct.productImage[0]}
                    alt={quickViewProduct.productName}
                    className="max-h-64 object-contain"
                  />
                </div>
                <div>
                  <p className="capitalize text-slate-500 mb-2">
                    {quickViewProduct.category}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (quickViewProduct.rating || 4)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.floor(Math.random() * 200) + 10} reviews)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-xl text-red-600 font-semibold">
                      {displayINRCurrency(quickViewProduct.sellingPrice)}
                    </span>
                    <span className="text-slate-500 line-through">
                      {displayINRCurrency(quickViewProduct.price)}
                    </span>
                    <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                      {Math.round(
                        ((quickViewProduct.price -
                          quickViewProduct.sellingPrice) /
                          quickViewProduct.price) *
                          100
                      )}
                      % off
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {quickViewProduct.description ||
                      'Premium quality product with fast shipping. Limited stock available, grab yours now!'}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <div className="border border-gray-300 rounded-full px-3 py-1 text-sm">
                      In Stock
                    </div>
                    <div className="border border-green-300 bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">
                      Fast Delivery
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-md"
                      onClick={e => {
                        handleAddToCart(e, quickViewProduct._id)
                        setTimeout(closeQuickView, 2000)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add to Cart
                    </motion.button>
                    <Link
                      to={`/product/${quickViewProduct._id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HorizontalCardProduct
