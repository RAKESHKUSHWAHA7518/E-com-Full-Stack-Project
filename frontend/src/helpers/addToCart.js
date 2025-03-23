// import React from 'react'

// const addToCart = () => {
//   return (
//     <div>
//       <h1> add to cart</h1>
//     </div>
//   )
// }

// export default addToCart


import SummaryApi from "../common"
import { toast } from 'react-toastify'

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()


//  api call for add to cart

    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json'
        },
        body : JSON.stringify(
            { productId : id }
        )
    })




    const responseData = await response.json()
    console.log("rakesh",responseData);
    

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
        console.log(responseData.message);
        
    }


    return responseData

}


export default addToCart
