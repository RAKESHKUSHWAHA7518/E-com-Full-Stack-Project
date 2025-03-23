import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
 import moment from 'moment'
 import { MdEdit } from "react-icons/md";
import ChangeUsersRole from '../components/ChangeUsersRole';
import { useSelector } from 'react-redux';
import ROLE from '../common/role';
 
  
const AllUsers = () => {

    const [allUser,setAllUsers] = useState([])

    const [openUpdateRole, setOpenUpdateRole]= useState(false)

    const  [updateUserDetails,setUpdateUserDetails]= useState({
        email: '',
        name: '',
        role: '',
        _id:'',
    })

    const user =useSelector(state=>state?.user?.user)

    // const navigate= useNavigate();

    const fetchAllUsers = async () => {
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method:SummaryApi.allUser.method,
            credentials:'include'
        })

        const dataResponse= await fetchData.json()

        if(dataResponse.success) {
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error) {
            toast.error(dataResponse.message)
        }

        console.log(dataResponse);




    }

    

    useEffect(()=>{

        fetchAllUsers();
        

    },[])

  return (
    <div className=' pb-4 bg-gray-100'>
       <table className='w-full userTable'>
        <thead>
            <tr className='bg-black text-white '>
            <th>Sr.:</th>
            <th>Name:</th>
            <th>Email:</th>
            <th>Role:</th>
            <th>Created Date:</th>
            {user?.role===ROLE.SUPERADMIN &&(
            <th>Action</th>
            )}
            </tr>
        </thead>
        <tbody className='pb-4 bg-gray-100'>
            {
                allUser.map((el,index)=>{
                    return (
                    <tr>
                        <td>{index+1}</td>
                        <td>{el?.name}</td>
                        <td>{el?.email}</td>
                        <td>{el?.role}</td>
                        <td>{moment(el?.createdAt).format('l')}</td>
                        {user?.role===ROLE.SUPERADMIN &&(
                        <td>
                         <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-800 hover:text-white'
                         onClick={()=>
                            {
                                setUpdateUserDetails(el)
                                setOpenUpdateRole(true)
                                
                            }
                            
                            }><MdEdit /></button>   </td>
                        )}
                    </tr>
                )

                })

            }
        </tbody>
       </table>
       {
        openUpdateRole && (
            <ChangeUsersRole onClose={()=>setOpenUpdateRole(false)} name= {updateUserDetails.name} 
            email={updateUserDetails.email}
            role= {updateUserDetails.role}
            userId={updateUserDetails._id}
            callFunc={fetchAllUsers}/>

        )
       }
     
        
    </div>
  )
}

export default AllUsers
