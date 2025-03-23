import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoClose } from "react-icons/io5";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUsersRole = ({name,email,role,onClose,userId,callFunc}) => {
    const  [userRole, setUserRole]= useState(role)

    const handleOnChangeselect =(e)=>{
        setUserRole(e.target.value)

        console.log(e.target.value);

    }

    const updateUserRole =async()=>{
        const fetchResponse= await fetch(SummaryApi.updateUser.url,{
            method:SummaryApi.updateUser.method,
            credentials:'include',
            headers:{'Content-Type':'application/json'
        },
        body:JSON.stringify( {
            userId:userId,
            role:userRole
        })

        }) 

        const responseData= await fetchResponse.json();

        if(responseData.success)
        {
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log( responseData)

    }
  return (
    <div className='relative top-0 bottom-0 left-0 right-0  w-full h-full z-10 flex justify-between items-center  bg-slate-200 bg-opacity-90 '>
      <div className='text-center  mx-auto bg-gray-100 shadow-md p-4 m-2 w-full max-w-sm '>
        <button className='block ml-auto' onClick={onClose}>
            <IoClose/>

        </button>
        <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>
        <p>Name: {name}</p>
        <p>Email: {email} </p>
        
         <div className='flex items-center justify-between my-4'>
         <p>Role</p>
         <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeselect}>
            {
                  Object.values(ROLE).map(el =>{
                    return(
                        <option value={el} key= {el}> {el}</option>
                    )
                  })
            }
             
         </select>
         </div>
         
         <button className='w-fit mx-auto border py-1 px-3 rounded-full bg-blue-600 text-white hover:bg-blue-700'onClick={updateUserRole}>Change Role</button>

      </div>
    </div>
  )
}

export default ChangeUsersRole
