import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({data,fetchData}) => {

    const [editProduct,setEditProduct]= useState(false)
  return (
      <div>
      <div className='p-4 m-2 rounded bg-white'>
               <div className='w-40 '>
               <div className='w-32 h-32 justify-center items-center'>
                <img className='mx-auto h-full object-fill' src={data?.productImage[0]} width={80} height={80}/>
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data?.productName}</h1>
                <div>
                  <div className='font-semibold'>
                    {/* <h1>{data?.sellingPrice}</h1> */}
                    {
                      displayINRCurrency(data?.sellingPrice)
                    }
                  </div>
                <div className='w-fit ml-auto  bg-green-100 p-2 hover:bg-green-600 rounded-full hover:text-white cursor-pointer ' onClick={()=>setEditProduct(true)}>
                <MdModeEditOutline />
                </div>

                </div>


                
               </div>
                {
                    editProduct && (
                        <AdminEditProduct productData={data} onclose={()=>setEditProduct(false)} fetchdata={fetchData}/>

                    )
                }
                
                </div>
    </div> 
  )
}

export default AdminProductCard
