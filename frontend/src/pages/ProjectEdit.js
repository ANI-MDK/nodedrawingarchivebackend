import {  useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

//import { useAuth } from '../AuthContext';

const ProjectEdit = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    const {state}= useLocation();
    let data={}; 
    data = (state!==null? state.row : "")
    // console.log(data);
    const initialData = {name:data.project_name, code:data.project_code, location:data.project_location, state:data.project_state, desc:data.project_description};
    const [project, setProject]=useState(initialData);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Project', path: '/projectlist' },
        { label: 'Edit Project', path: '/projectedit' }
    ]

    useEffect(()=>{
        //if(state===null) navigate("/dashboard")
        (permissions!==null && permissions.is_admin_user==="Y") ? navigate("/projectedit",{state}) : navigate("/dashboard")
    },[]);

    const indianStatesAndUTs = [
        { id: 1, name: "Andhra Pradesh" },
        { id: 2, name: "Arunachal Pradesh" },
        { id: 3, name: "Assam" },
        { id: 4, name: "Bihar" },
        { id: 5, name: "Chhattisgarh" },
        { id: 6, name: "Goa" },
        { id: 7, name: "Gujarat" },
        { id: 8, name: "Haryana" },
        { id: 9, name: "Himachal Pradesh" },
        { id: 10, name: "Jharkhand" },
        { id: 11, name: "Karnataka" },
        { id: 12, name: "Kerala" },
        { id: 13, name: "Madhya Pradesh" },
        { id: 14, name: "Maharashtra" },
        { id: 15, name: "Manipur" },
        { id: 16, name: "Meghalaya" },
        { id: 17, name: "Mizoram" },
        { id: 18, name: "Nagaland" },
        { id: 19, name: "Odisha" },
        { id: 20, name: "Punjab" },
        { id: 21, name: "Rajasthan" },
        { id: 22, name: "Sikkim" },
        { id: 23, name: "Tamil Nadu" },
        { id: 24, name: "Telangana" },
        { id: 25, name: "Tripura" },
        { id: 26, name: "Uttar Pradesh" },
        { id: 27, name: "Uttarakhand" },
        { id: 28, name: "West Bengal" },
        { id: 29, name: "Andaman and Nicobar Islands" },
        { id: 30, name: "Chandigarh" },
        { id: 31, name: "Dadra and Nagar Haveli and Daman and Diu" },
        { id: 32, name: "Lakshadweep" },
        { id: 33, name: "Delhi" },
        { id: 34, name: "Puducherry" },
        { id: 35, name: "Ladakh" },
        { id: 36, name: "Jammu and Kashmir" }
      ];


    const Options=({options})=>{
        if(undefined !== options) {
            return(
                options.map(option => 
                    (<option key={option.id} value={option.name}>{option.name}</option>))
            );
        }
    }
  

    const handleProjectEditChange=(e)=>{
        const{ name, value} = e.target;
        setProject({...project, [name]:value});
    }

    const handelProjectEditSubmit= (e) =>{
        //console.log(project);
        e.preventDefault(); 
        axios.put(`${baseUrl}/project/updateproject/${data.project_id}`,{project_name:project.name,project_code:project.code,project_location:project.location,project_state:project.state,project_description:project.desc},
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
                        //console.log(response);
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        setTimeout(()=>{
                            navigate("/projectlist");
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
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Project Edit Section:</h3>
                                    <form onSubmit={handelProjectEditSubmit}>
                                        <div className="bg-gray-300 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Project Name:</label>
                                                    <input type="text" id="name" name="name" value={project.name} placeholder="Enter Project Name here" onChange={handleProjectEditChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Project Code:</label>
                                                    <input type="text" id="code" name="code" value={project.code} placeholder="Enter Project Code here" onChange={handleProjectEditChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Location Name:</label>
                                                    <input type="text" id="location" name="location" value={project.location} placeholder="Enter Location here" onChange={handleProjectEditChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>State:</label>
                                                    <select id="state" name="state" value={project.state} onChange={handleProjectEditChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required>
                                                        <option value="">--Please select State/UT here--</option>
                                                        <Options options={indianStatesAndUTs} />
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3">
                                                <div className="w-full px-3">
                                                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description:</label>
                                                    <textarea id="desc" name="desc" value={project.desc} placeholder="Enter Project Description here" onChange={handleProjectEditChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"/>
                                                </div>
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

  export default ProjectEdit;