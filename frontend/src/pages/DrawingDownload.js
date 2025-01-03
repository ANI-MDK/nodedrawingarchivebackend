import {  useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";


//import { useAuth } from "../AuthContext";

const DrawingDownload = () => {
    //const { token, userData } = useAuth();
    
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [down, setDown]=useState("");
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    //console.log(Atoken);
    const {state}= useLocation();
    let data={}; 
    data=(state!==null? state : "")

    const [loader, setLoader]=useState(false);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Drawing', path: '/drawinglist' },
        { label: 'Drawing Details', path: '/drawingdetail' },
        { label: 'Drawing Download', path: '/drawingdownload' }
    ]

    useEffect(()=>{
        if(state===null) navigate("/dashboard") 
    },[]);

    const handelDownloadSubmit= (e) =>{
        e.preventDefault(); 

        setLoader(true);
        axios.post(`${baseUrl}/drawing/downloaddrawing`,{project_id:data.state.row.project_id, drawing_id:data.state.row.drawing_id, drawing_file_id:data.id, download_reason:down},
            {
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Atoken}`,
                    withCredentials:true
                },
                responseType: 'blob'
            })
            .then(response => 
                {
                    //console.log(response.data);
                    setLoader(false);
                    if(response.data.status==="error")
                    {
                        toast.error(response.data.message,{position:"top-center"})
                    }
                    else if((response.data.status==="error") && (response.data.message==="Invalid token")){
                        toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000})
                        setTimeout(()=>{
                            navigate("/");
                        },5000);
                    }
                    else{
                        toast.success("File download successful...",{position:"top-center", duration: 5000});
                        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                        const fileLink = document.createElement('a');
                        fileLink.href = fileURL;
                        const contentDisposition = response.headers['content-disposition'];
                        const fileName = contentDisposition.substring(
                        contentDisposition.indexOf('filename=') + 9,
                        contentDisposition.length
                        );
                        fileLink.setAttribute('download', fileName);
                        fileLink.setAttribute('target', '_blank');
                        document.body.appendChild(fileLink);
                        fileLink.click();
                        fileLink.remove();

                        setTimeout(()=>
                        {
                            navigate("/drawingdetail",{state:data.state});
                        },5000);
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
        setDown("");
    }
    const handleBackClick=()=>{
        navigate("/drawingdetail",{state:data.state});
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
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Drawing Download Section:</h3>
                                    <form onSubmit={handelDownloadSubmit}>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3 mb-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Reason for downloading the file:- <span className="ml-1 text-md text-red-500 font-bold">{data.name}</span></label>
                                                    <textarea  id="reason" name="down" value={down} placeholder="Enter the Reason for download here.." onChange={(e)=>setDown(e.target.value)} className="block mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div>
                                        </div>
                                        {loader ? 
                                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                                            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-yellow-400"></div>
                                        </div>
                                        : "" }
                                        <div className="mt-4">
                                            <input type="submit" value="Download" className="inline-block text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-8 py-2.5 me-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-500 dark:border-green-900 mr-2 cursor-pointer"/>
                                            <button type="button" className="inline-blockfocus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900 mr-2" onClick={handelReset}>Reset</button>
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

  export default DrawingDownload;