import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';



const Login = () => {

    const  [showPassword,setshowPassword] = useState(false);

    const [data, setData] =useState({
        email : "",
        password :""
})

const navigate = useNavigate()
  const {fetchUserDetails,fetchUserAddToCart} =  useContext(Context);

   console.log("Rakesh:",fetchUserDetails());
  

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
    const  dataResponse = await fetch(SummaryApi.signIn.url,{
            method: SummaryApi.signIn.method,
            credentials:'include',
            headers:{
                "content-type":"application/json"
            },
            body :JSON.stringify(data)
        }
    )

    const dataApi= await  dataResponse.json()

    if(dataApi.success){
        toast.success(dataApi.message)
        

        navigate('/')

        fetchUserDetails()
        fetchUserAddToCart()

    }

    if(dataApi.error){
        toast.error(dataApi.message)

    }
}

console.log(data)

  return (
     <section id='login'>
        <div className='mx-auto container p-4 '>
            <div className='bg-gray-50 p-2 py-5 w-full max-w-sm mx-auto rounded-lg'>
                <div className='w-20 h-20 mx-auto '>
                    <img src= {loginIcons} alt='login icon' />
                </div>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='grid'>
                        <label>Email:</label>
                        <div className='bg-slate-100 p-2'>
                        <input className='h-full w-full outline-none bg-transparent' type='email' placeholder='Enter Email'
                        name= 'email'
                        value={data.email}
                        onChange={handleOnChange}
                        />
                        </div>
                    </div>

                    <div>
                        <label>Password:</label>
                        <div className='bg-slate-100 p-2 flex'>
                        <input className='h-full w-full outline-none bg-transparent' type={showPassword? "text":"password"} placeholder='Enter Password'
                        
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
                         <Link to={'/forgot-password'}  className='block w-fit ml-auto hover:text-blue-400  '>
                         Forgot Password
                         </Link>
                    </div>
                    
                   

                     <button className='bg-red-500 text-white w-full px-6 py-2 my-5 max-w-[150px] rounded-full  hover:scale-110 transition-all mx-auto block '>Login</button>
                </form>
                <p className='my-4 '> Don't have account ? <Link className=' hover:text-blue-400' to ={'/sign-up'}> Sign up</Link> </p>

            </div>

        </div>

     </section>
  )
}

export default Login
