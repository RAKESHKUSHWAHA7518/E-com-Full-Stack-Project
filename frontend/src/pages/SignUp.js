import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import imagetobase64 from '../helpers/imagetobase64';
import SummaryApi from '../common';

import { toast } from 'react-toastify';




const SignUp = () => {

    const  [showPassword,setshowPassword] = useState(false);
    const  [showConfirmPassword,setshowConfirmPassword] = useState(false);


    const [data, setData] =useState({
        email : "",
        password :"",
        confirmpassword:"",
        profilePic: "",
})

const navigate = useNavigate()

const handleOnChange=(e)=>{
    const {name ,value}= e.target

    setData((preve)=>{
        return {
            ...preve,
        [name]:value
        }
    })
}

const handleSubmit = async(e)=>{
    e.preventDefault()

    if(data.password===data.confirmpassword){
        const dataResponse = await fetch(SummaryApi.signUP.url,{
            method: SummaryApi.signUP.method,
            headers:{
                "content-type":"application/json"
            },
            body :JSON.stringify(data)
    
        })
    
        const  dataApi =await dataResponse.json()

        if(dataApi.success){
            toast.success(dataApi.message)
            navigate('/login')
        }

        if(dataApi.error){
            toast.error(dataApi.message) 
        }

        // toast(dataApi.message)
    
        // console.log(dataApi)
    }else{
       console.log("please check password"); 
    }
   
}

 


const handleuploadpic =async (e)=>{
    const file =e.target.files[0]
    const imagePic= await imagetobase64(file)

    console.log("imagePic",imagePic)

    setData ((preve)=>{
        return {
            ...preve,
            profilePic: imagePic
        }
})

    console.log(file)
}

  return (
    
    <section id='login'>
  <div className='mx-auto container p-4 '>
      <div className='bg-gray-50 p-2 py-5 w-full max-w-sm mx-auto rounded-lg'>
          <div className='w-20 h-20 mx-auto  relative overflow-hidden rounded-full'>
              <div>
              <img src= {data.profilePic||loginIcons} alt='login icon' />
              </div>
              <form>
                <label>
                <div className='text-xs bg-opacity-90 pb-4 pt-2 bg-slate-200 py-4  cursor-pointer text-center absolute bottom-0 w-full'>
                Upload Photo  
              </div>
                    <input type='file' className='hidden' onChange={handleuploadpic} />
                </label>
                

              </form>
             
          </div>
          <form className=' pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>

          <div className='grid'>
                  <label>Name:</label>
                  <div className='bg-slate-100 p-2'>
                  <input className='h-full w-full outline-none bg-transparent' type='text' required placeholder='Enter Name'
                  name= 'name'
                  value={data.name}
                  onChange={handleOnChange}
                  />
                  </div>
              </div>
              <div className='grid'>
                  <label>Email:</label>
                  <div className='bg-slate-100 p-2'>
                  <input className='h-full w-full outline-none bg-transparent' type='email' required placeholder='Enter Email'
                  name= 'email'
                  value={data.email}
                  onChange={handleOnChange}
                  />
                  </div>
              </div>

              <div>
                  <label>Password:</label>
                  <div className='bg-slate-100 p-2 flex'>
                  <input className='h-full w-full outline-none bg-transparent' type={showPassword? "text":"password"} required placeholder='Enter Password'
                  
                  onChange={handleOnChange}
                  name='password'
                  value={data.password}/>
                  <div className='cursor-pointer text-xl' 
                    onClick={()=> setshowPassword((preve)=>!preve)}>
                      <span >
                          {showPassword ?(<FaEye />):(<FaEyeSlash/>)}
                          
                      
                      </span>
                  </div>
                  </div>
                   
              </div>

              <div>
                  <label>Confirm Password:</label>
                  <div className='bg-slate-100 p-2 flex'>
                  <input className='h-full w-full outline-none bg-transparent' required type={showPassword? "text":"password"} placeholder='Enter Password'
                  
                  onChange={handleOnChange}
                  name='confirmpassword'
                  value={data.confirmpassword}/>
                  <div className='cursor-pointer text-xl' 
                    onClick={()=> setshowConfirmPassword((preve)=>!preve)}>
                      <span >
                          {showConfirmPassword ?(<FaEye />):(<FaEyeSlash/>)}
                          
                      
                      </span>
                  </div>
                  </div>
                   
              </div>
              
             

               <button className='bg-red-500 text-white w-full px-6 py-2 my-5 max-w-[150px] rounded-full  hover:scale-110 transition-all mx-auto block '>SignUp</button>
          </form>
          <p className='my-4 '> Already have account ? <Link className=' hover:text-blue-400' to ={'/login'}> Login</Link> </p>

      </div>

  </div>

</section>
  )
}

export default SignUp
