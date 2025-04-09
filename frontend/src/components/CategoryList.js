// import React, { useEffect, useState } from 'react'
// import SummaryApi from '../common'
// import { Link } from 'react-router-dom'

// const CategoryList = () => {
//     const [categoryProduct,setCategoryProduct] = useState([])
//     const [loading,setLoading] = useState(false)

//     const categoryLoading = new Array(13).fill(null)

//     const fetchCategoryProduct = async() =>{
//         setLoading(true)
//         const response = await fetch(SummaryApi.categoryProduct.url,{
//             method : SummaryApi.categoryProduct.method,
//         })
//         const dataResponse = await response.json()
//         setLoading(false)
//         setCategoryProduct(dataResponse.data)
//         console.log(dataResponse.data);
        
//     }

//     useEffect(()=>{
//         fetchCategoryProduct()
//     },[])

//   return (
//     <div className='container mx-auto p-4'>
//            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none  '>
//             {

//                 loading ? (
//                     categoryLoading.map((el,index)=>{
//                             return(
//                                 <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>
//                                 </div>
//                             )
//                     })  
//                 ) :
//                 (
//                     categoryProduct.map((product,index)=>{
//                         return(
//                             <Link to={"/product-category?category="+product?.category} className='cursor-pointer' key={product?.category}>
//                                 <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
//                                     <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
//                                 </div>
//                                 <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
//                             </Link>
//                         )
//                     })
//                 )
//             }
//            </div>
//     </div>
//   )
// }

// export default CategoryList


import React, { useEffect, useState, useRef } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

// Array of gradient border styles for categories
const categoryGradients = [
  'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',  // Warm Pink
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',              // Fresh Blue
  'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',            // Green/Cyan
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)',            // Pink/Yellow
  'linear-gradient(to top, #30cfd0 0%, #330867 100%)',              // Teal/Purple
  'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)', // Sunset
  'linear-gradient(to top, #ff0844 0%, #ffb199 100%)',              // Red/Orange
  'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)',               // Ocean Blue
  'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)', // Fiery Red
  'linear-gradient(to top, #c471f5 0%, #fa71cd 100%)',              // Purple/Pink
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',            // Blue/Cyan
  'linear-gradient(to right, #0fd850 0%, #f9f047 100%)',            // Green/Yellow
  'linear-gradient(to right, #f83600 0%, #f9d423 100%)'             // Orange/Yellow
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  
  const scrollElement = useRef()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const categoryLoading = new Array(13).fill(null)
  
  const fetchCategoryProduct = async() => {
    setLoading(true)
    const response = await fetch(SummaryApi.categoryProduct.url, {
      method: SummaryApi.categoryProduct.method,
    })
    const dataResponse = await response.json()
    setLoading(false)
    setCategoryProduct(dataResponse.data)
  }
  
  useEffect(() => {
    fetchCategoryProduct()
  }, [])
  
  // Get a gradient style for a category based on its index
  const getCategoryGradient = (index) => {
    return categoryGradients[index % categoryGradients.length]
  }
  
  // Scroll controls for category list
  const scrollRight = () => {
    scrollElement.current.scrollBy({ left: 200, behavior: 'smooth' })
  }
  
  const scrollLeft = () => {
    scrollElement.current.scrollBy({ left: -200, behavior: 'smooth' })
  }
  
  // Handle category hover/selection
  const handleCategoryHover = (category) => {
    setActiveCategory(category)
  }
  
  // Add dynamic styles to the document
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes borderRotate {
        0% { border-radius: 30% 70% 70% 30% / 30% 52% 48% 70%; }
        50% { border-radius: 43% 57% 62% 38% / 53% 45% 55% 47%; }
        100% { border-radius: 30% 70% 70% 30% / 30% 52% 48% 70%; }
      }
      
      .category-item {
        border: 3px solid transparent;
        position: relative;
        transition: all 0.3s ease;
        animation: borderRotate 10s infinite;
      }
      
      .category-item:hover {
        transform: scale(1.1);
      }
      
      .category-item::before {
        content: '';
        position: absolute;
        inset: -5px;
        border-radius: inherit;
        padding: 5px;
        background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
        -webkit-mask: 
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .category-item:hover::before {
        opacity: 1;
      }
      
      .glow-effect {
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        transition: box-shadow 0.3s ease;
      }
      
      .glow-effect:hover {
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
      }
      
      .category-name {
        position: relative;
        overflow: hidden;
      }
      
      .category-name::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, currentColor, transparent);
        transition: width 0.3s ease;
      }
      
      .category-item:hover + .category-name::after,
      .category-name:hover::after {
        width: 100%;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      .shimmer-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return (
    <div className='container mx-auto p-4 my-6' ref={ref}>
      {/* <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">Shop by Category</h2> */}
      
      <div className='relative'>
        {/* <motion.button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden md:flex items-center justify-center"
          onClick={scrollLeft}
          whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
        >
          <FaAngleLeft className="text-gray-600" />
        </motion.button> */}
        
        <motion.div 
          className='flex items-center gap-8 overflow-x-auto scrollbar-none py-4 px-2'
          ref={scrollElement}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
        >
          <AnimatePresence>
            {loading ? (
              categoryLoading.map((el, index) => {
                return (
                  <motion.div 
                    className='flex flex-col items-center gap-2' 
                    key={"categoryLoading"+index}
                    variants={itemVariants}
                  >
                    <div className='h-16 w-16 md:w-24 md:h-24 rounded-full shimmer-loading'></div>
                    <div className='h-4 w-14 rounded shimmer-loading'></div>
                  </motion.div>
                )
              })
            ) : (
              categoryProduct.map((product, index) => {
                const isActive = activeCategory === product?.category;
                const gradientStyle = getCategoryGradient(index);
                
                return (
                  <motion.div 
                    className='flex flex-col items-center gap-2 cursor-pointer' 
                    key={product?.category}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => handleCategoryHover(product?.category)}
                    onHoverEnd={() => setActiveCategory(null)}
                  >
                    <Link to={"/product-category?category="+product?.category}>
                      <motion.div 
                        className='w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden category-item glow-effect flex items-center justify-center'
                        style={{ 
                          backgroundImage: gradientStyle,
                          padding: '4px',
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: '0 0 15px rgba(0,0,0,0.2)'
                        }}
                        animate={{ 
                          boxShadow: isActive ? '0 0 20px rgba(0,0,0,0.3)' : '0 0 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center p-3">
                          <motion.img 
                            src={product?.productImage[0]} 
                            alt={product?.category} 
                            className='h-full w-full object-contain mix-blend-multiply'
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          />
                        </div>
                      </motion.div>
                    </Link>
                    <p className='text-center text-sm md:text-base capitalize font-medium category-name'>
                      {product?.category}
                    </p>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* <motion.button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden md:flex items-center justify-center"
          onClick={scrollRight}
          whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
        >
          <FaAngleRight className="text-gray-600" />
        </motion.button> */}
      </div>
    </div>
  )
}

export default CategoryList