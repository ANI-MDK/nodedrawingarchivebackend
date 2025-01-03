import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

//import { useAuth } from "../AuthContext"; 

const RoleAdd = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [role, setRole]=useState("");
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    //console.log(Atoken);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Role', path: '/rolelist' },
        { label: 'Add Role', path: '/roleadd' }
    ]


    useEffect(()=>{
        (permissions!==null && permissions.is_admin_user==="Y") ? navigate("/roleadd"): navigate("/dashboard")
    },[]);

    const handleRoleAddChange=(e)=>{
        setRole(e.target.value);
    }

    const handelRoleAddSubmit= (e) =>{
        //console.log(role);
        e.preventDefault(); 
        axios.post(`${baseUrl}/role/createrole`,{role_name:role},
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true
                    }
            })
            .then(response => 
                {
                    //console.log(response);
                    if(response.data.status==="success")
                    {
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        setTimeout(()=>{
                            navigate("/rolelist");
                        },5000);
                        
                    }
                    else if((response.data.status==="error") && (response.data.message==="Invalid token")){
                        toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000})
                        setTimeout(()=>{
                            navigate("/");
                        },5000);
                    }
                    else{
                        toast.error(response.data.message,{position:"top-center"})
                    }
                }
            )
            .catch(error => 
                {
                toast.error(error,{position:"top-center"});
                }
            );
    }

    const handelReset=()=>{
        setRole("");
    }
    const handleBackClick=()=>{
        navigate("/rolelist");
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow mb-8"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                    <Breadcrumb crumbs={crumbs}/>
                    <div className="container max-h-[1000vh] overflow-y-auto">
                        <div className="container mt-8">
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-5xl bg-cyan-700 bg-opacity-70 shadow-lg rounded-lg p-5 my-2">
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Role Add Section:</h3>
                                    <form onSubmit={handelRoleAddSubmit}>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3 mb-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Role Name:</label>
                                                    <input type="text" id="name" name="name" value={role} placeholder="Enter Role Name here" onChange={handleRoleAddChange} className="block mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <input type="submit" value="Save" className="inline-block text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-500 dark:border-green-900 mr-2 cursor-pointer"/>
                                            <button type="button" className="inline-block focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900 mr-2" onClick={handelReset}>Reset</button>
                                            <button type="button" className="inline-block text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-800 mr-2"  onClick={handleBackClick}>Back</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer/>
            </div>
            <Footer/>
        </div>
    );
  };

  export default RoleAdd;