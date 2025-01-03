import {  useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
//import axios from 'axios';
//import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

const ProjectDetail = () => {

    const navigate = useNavigate();
    const {state}= useLocation();
    let data={}; 
    data=(state!==null? state.row : "")
    //console.log(data);
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Project', path: '/projectlist' },
        { label: 'Project Detail', path: '/projectdetail' }
    ]

    useEffect(()=>{
        (permissions!==null && permissions.is_admin_user==="Y") ? navigate("/projectdetail",{state} ): navigate("/dashboard")
    },[]);

    const handleBackClick=()=>{
        navigate("/projectlist");
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow mb-8"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                    <Breadcrumb crumbs={crumbs} />
                    <div className="container max-h-[1000vh] overflow-y-auto">
                        <div className="container mt-8">
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-5xl bg-cyan-700 bg-opacity-70 shadow-lg rounded-lg p-5 my-2">
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Project Detail Section:</h3>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="name" className="text-lg font-medium text-gray-700">Project Name:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_name}</label>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="code" className="text-lg font-medium text-gray-700">Project Code:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_code}</label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="location" className="text-lg font-medium text-gray-700">Location Name:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_location}</label>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="state" className="text-lg font-medium text-gray-700">State:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_state}</label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3">
                                                <div className="w-full px-3">
                                                    <label htmlFor="desc" className="text-lg font-medium text-gray-700">Description:</label>
                                                    <label className="block mt-1 p-2 w-full border border-gray-400 rounded-md bg-gray-300 text-wrap break-words">{data.project_description===""? <span className="text-white">N/A</span>: data.project_description}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button type="button" className="inline-block text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-800 mr-2"  onClick={handleBackClick}>Back</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
  };

  export default ProjectDetail;