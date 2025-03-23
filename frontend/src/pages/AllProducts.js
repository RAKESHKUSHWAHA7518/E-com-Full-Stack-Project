 import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
 
 const AllProducts = () => {

  const [openUploadProduct,setOpenUploadProduct]= useState(false)
  const [allProduct,setAllProduct] = useState([])


  const fetchAllProducts =async()=>{
    const response= await fetch(SummaryApi.allProduct.url)
    const dataResponse= await response.json()
    setAllProduct(dataResponse?.data ||[])
    console.log("Product",dataResponse?.data ||[]);
  }

  useEffect(()=>{
    fetchAllProducts();

  },[])


  

   return (
     <div className='bg-slate-100'>
       <div className='bg-gray-100 py-2 px-4 flex justify-between  items-center'>
        <h2 className='font-bold text-lg'> All Products  </h2>
        <button className='border-2 border-red-500 py-2 px-2 rounded-full hover:bg-red-600 hover:text-white transition-all ' onClick={()=>setOpenUploadProduct(true)}> Upload Product</button>

       </div>
       {/* All Product */}

       
       <div className='flex flex-wrap items-center gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll ' >
        {
          allProduct.map((product,index)=>{
            return(
              <AdminProductCard data={product} key={index +"allproduct"} fetchData={fetchAllProducts}/>
              
            )

          })
        }

{/* {
  allProduct.map((product, index) => (
    <div key={index}>
      {product.productImage && product.productImage[0] ? (
        <img src={product.productImage[0]} width={80} height={80} alt={`Product ${index}`} />
      ) : (
        <span>No Image Available</span>
      )}
    </div>
  ))
} */}

       </div>

       {
        openUploadProduct && (
          <UploadProduct onclose={()=>setOpenUploadProduct(false)}    fetchData={fetchAllProducts}/>

        )
       }



       
     </div>
   )
 }
 
 export default AllProducts
 