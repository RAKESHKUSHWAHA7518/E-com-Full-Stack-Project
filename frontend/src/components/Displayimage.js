import React from 'react'
import { IoCloseSharp } from "react-icons/io5";

const Displayimage = ({
    imgUrl,onClose
}) => {
  return (
    <div className='fixed bottom-0 top-0 right-0 left-0 flex  justify-center items-center '>
        <div className='bg-white shadow-lg rounded max-w-5xl mx-auto'>
        <div className='text-3xl ml-auto w-fit hover:text-red-500 cursor-pointer' onClick={ onClose}>
            <IoCloseSharp />
            </div>
        <div className='flex justify-center p-4 max-w-[80vh] max-h-[80vh]'>
      <img src= {imgUrl} className='w-full h-auto'/>
    </div>

        </div>
       
    </div>
  )
}

export default Displayimage
