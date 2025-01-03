import {  useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

//import { useAuth } from "../AuthContext";

const UserPassword = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const initialData = {pass:"", conf:""};
    const [user, setUser]=useState(initialData);
    const [flag, setFlag]=useState(false);

    const navigate = useNavigate();
    const {state}= useLocation();
    let data={};
    data=((state!==null) ? state.row :"" );
    //console.log(id);
    const Atoken = JSON.parse(localStorage.getItem('token'));
    //console.log(Atoken);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'User', path: '/userlist' },
        { label: 'User Password', path: '/userpassword' }
    ]

    useEffect(()=>{
        if(state===null) navigate("/dashboard") 
    },[]);

    const handleUserPasswordChange=(e)=>{
        const{ name, value} = e.target;
        setUser({...user, [name]:value});
    }

    const handelUserPasswordChangeSubmit= (e) =>{
        e.preventDefault();
        //console.log(user);

        if(user.pass === user.conf){
            setFlag(false);
            axios.put(`${baseUrl}/user/updateuserpassword/${data.user_id}`,{user_password:user.conf},
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true
                    }
            })
            .then(response => 
                {
                    if(response.data.status==="success")
                    {
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        setTimeout(()=>{
                            navigate("/userlist");
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
        else{
            setFlag(true);
        }
    }

    const handleBackClick=()=>{
        navigate("/userlist");
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
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Change Password for : <span className="ml-2 text-red-700 text-lg tracking-wider">{data.user_name}</span></h3>
                                    <form onSubmit={handelUserPasswordChangeSubmit}>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3 mb-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>New Password:</label>
                                                    <input type="text" id="pass" name="pass" value={user.pass} placeholder="Enter New Password here" onChange={handleUserPasswordChange} className="block mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                                <div className="w-full px-3 mb-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Confirm Password:</label>
                                                    <input type="text" id="conf" name="conf" value={user.conf} placeholder="Re-Enter New Password here" onChange={handleUserPasswordChange} className="block mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                                {flag ? <label htmlFor="flag" className="block mx-auto text-sm font-medium text-red-500">Password & Confirm Password do not match</label>: ""}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <input type="submit" value="Save" className="inline-block text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-500 dark:border-green-900 mr-2 cursor-pointer"/>
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

  export default UserPassword;