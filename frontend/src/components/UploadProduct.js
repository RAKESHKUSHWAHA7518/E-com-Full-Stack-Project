import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import productCategory from '../helpers/productCategory';
import { IoCloudUploadSharp } from "react-icons/io5";
import uploadimage from '../helpers/uploadimage';
import Displayimage from './Displayimage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common'
// import { toast } from 'react-toastify';
// import { toast } from 'react-toastify'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UploadProduct = ({
    onclose,
    fetchData
}) => {

    const [data ,setData]= useState({
        productName:'',
        brandName:'',
        category:'',
        productImage:[],
        description:'',
        price:'',
        sellingPrice:'',



    })

    const [openFullScreenImage, setOpenFullScreenImage] = useState('')
    const [fullScreenImage, setFullScreenImage] = useState('')

    // const [uploadproductImageInput,setUploadproductImageInput] = useState('')

    const handleOnChange=(e)=>{
      const { name,value } = e.target
      setData((preve)=>{
        return{
          ...preve,
           [name]: value
        }

      })

    }

    const handleUploadProduct = async(e)=>{

      const file = e.target.files[0];
      // setUploadproductImageInput(file.name)
      // console.log(file);

      const uploadImageCloundinary= await uploadimage(file)
      setData((preve)=>{
        return{
          ...preve,
          productImage :[...preve.productImage,uploadImageCloundinary.url]
        }

      })
      // console.log("upload",uploadImageCloundinary.url);
    }

    const handleDeleteProductImage = async(index)=>{
      const newProductImage =[...data.productImage]
      newProductImage.splice(index, 1)
      setData((preve)=>{
        return{
          ...preve,
          productImage :[...newProductImage]
        }

      })


    }


     

    // Upload Product

    const handleSubmit= async(e)=>{
      e.preventDefault()
      console.log("data",data);
      
      const response = await fetch(SummaryApi.uploadProduct.url,{
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers:{
          'content-type': 'application/json'
        },
        body:JSON.stringify(data)
      })

      const responseData = await response.json()

       console.log(responseData);

    //    if(responseData.success){
    // toast.success(responseData?.message)

    //    }

    if (responseData.success) {
      toast.success(responseData.message);
      onclose();
      fetchData()

  }

  if (responseData.error) {
      toast.error(responseData.message);
  }
      // if(responseData.success){
      //   toast.success(responseData.message)
      //   onclose()
      // }
      // if(responseData.error){
      //   toast.error(responseData?.message)
      // }


    }

  return (
    <div className='fixed bg-slate-400 bg-opacity-40 top-0 right-0 bottom-0 left-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded  w-full max-w-sm  lg:max-w-2xl h-full max-h-[50%] lg:max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
        
            <h2 className='font-bold text-lg'>  UploadProduct</h2>
            <div className='text-3xl ml-auto w-fit hover:text-red-500 cursor-pointer' onClick={ onclose}>
            <IoCloseSharp />
            </div>
        </div>
        <form className='grid p-4 gap-3 overflow-y-scroll h-full pb-5 ' onSubmit={handleSubmit}>
        <label htmlFor='productName'>Product Name:</label>
        <input
         type='text' 
         id='productName' 
         name='productName'
         placeholder='Enter product name'
          value={data.productName} 
          onChange={handleOnChange}
          className='p-2 bg-slate-100 border rounded'
          required/> 

        <label htmlFor='brandName'>Brand Name:</label>
        <input
         type='text' 
         id='brandName' 
         name='brandName'
         placeholder='Enter Brand name'
          value={data.brandName} 
          onChange={handleOnChange}
          className='p-2 bg-slate-100 border rounded'
          required/> 

        <label htmlFor='category'>Category Name:</label>
         <select value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
         <option value={""} > Select Category</option>
          {
            productCategory.map((el,index)=>{
              return(
                <option value={el.value} key={el.value+index}>{el.label}</option>
              )
            })
          }
         </select>

         <label htmlFor='productImage' className='mt-3' >Product Image:</label>
         <label htmlFor='uploadImageInput'>
         <div className='p-2 bg-slate-100 border rounded h-32  w-full flex justify-center items-center cursor-pointer'>
         <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
         <span className='text-3xl'> <IoCloudUploadSharp /></span>
         <p> Upload Product Image</p>
         <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
         </div> 
         </div>
         </label>
         <div>
          {
            data?.productImage[0]?(
              <div className='flex items-center gap-2'>
              {
              data.productImage.map((el,index)=>{
                return(
                  <div className='relative group'>
                  <img src={el} alt= {el} width={80} height={80} className=' bg-slate-100 border cursor-pointer'  onClick={()=>{
                    setOpenFullScreenImage(true)
                    setFullScreenImage(el)
                  }}/>
                  <div className='absolute bottom-0 right-0 p-1 text-white bg-red-700 rounded-full cursor-pointer  hidden group-hover:block ' onClick={()=>handleDeleteProductImage(index)}>
                    <MdDelete />
                    </div>
                  </div>
        

                )
              })
            }
             </div> 

            ):(
              <p className='text-red-600 text-xs'>  Please upload product image</p>

            )
          }
           </div>

           <label htmlFor='price' className='mt-3'>Price:</label>
           <input
         type='number' 
         id='price' 
         name='price'
         placeholder='Enter price'
          value={data.price} 
          onChange={handleOnChange}
          className='p-2 bg-slate-100 border rounded'
          required/>


<label htmlFor='sellingPrice' className='mt-3'>Selling Price:</label>
           <input
         type='number' 
         id='sellingPrice' 
         name='sellingPrice'
         placeholder='Enter selling price'
          value={data.sellingPrice} 
          onChange={handleOnChange}
          className='p-2 bg-slate-100 border rounded'
          required/>

<label htmlFor='description' className='mt-3'>Description:</label>
<textarea className='h-28 bg-slate-100 border resize-none p-1' placeholder='Enter Product Description' onChange={handleOnChange} name='description' value={data.description} rows={3}>

</textarea>


           <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'> Upload product</button>


        </form >
       
       
      </div>
      { 
      openFullScreenImage &&(
      <Displayimage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )
}
    </div>
  )
}

export default UploadProduct
