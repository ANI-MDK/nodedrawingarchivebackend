
//import DataTable from 'react-data-table-component';
import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from '../components/breadcrump';
import {  useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


const Dashboard = () => {
    const crumbs = [
        { label: '', path: '/dashboard' },
    ]

    const baseUrl = process.env.REACT_APP_BASE_URL;
    //const {state} = useLocation();
    //console.log(state);

    const [dash, setDash]=useState([]);
    const [projects, setProjects]=useState([]);
    const [down, setDown]=useState([]);
    const [contributor, setContributor]=useState([]);
    const [viewer, setViewer]=useState([]);
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions= JSON.parse(localStorage.getItem('UserData'));
    
    const getTotalFilesAPI=()=>{
        axios.get(`${baseUrl}/dashboard/gettotaluploadedfile`,{ 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`
            },
            withCredentials:true,
        })
        .then(response => {
            //console.log(response.data.data);
            if(response.data.status==="success")
            {
                setDash(response.data.data[0]);
            }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            {
                toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                setTimeout(()=>{
                    navigate("/");
                },5000);
            }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    const getTotalProjectsAPI=()=>{
        axios.get(`${baseUrl}/dashboard/gettotalproject`,{ 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`
            },
            withCredentials:true,
        })
        .then(response => {
            //console.log(response);
            if(response.data.status==="success")
            {
                setProjects(response.data.data[0]);
            }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            {
                toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                setTimeout(()=>{
                    navigate("/");
                },5000);
            }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    const getTotalDownloadsAPI=()=>{
        axios.get(`${baseUrl}/dashboard/gettotaldownload`,{ 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`
            },
            withCredentials:true,
        })
        .then(response => {
            //console.log(response);
            if(response.data.status==="success")
            {
                setDown(response.data.data[0]);
            }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            {
                toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                setTimeout(()=>{
                    navigate("/");
                },5000);
            }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    const getTotalContributorAPI=()=>{
        axios.get(`${baseUrl}/dashboard/gettotalcontributor`,{ 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`
            },
            withCredentials:true,
        })
        .then(response => {
            //console.log(response);
            if(response.data.status==="success")
            {
                setContributor(response.data.data[0]);
            }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            {
                toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                setTimeout(()=>{
                    navigate("/");
                },5000);
            }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }


    const getTotalViewerAPI=()=>{
        axios.get(`${baseUrl}/dashboard/gettotalviewer`,{ 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`
            },
            withCredentials:true,
        })
        .then(response => {
            //console.log(response);
            if(response.data.status==="success")
            {
                setViewer(response.data.data[0]);
            }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            {
                toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                setTimeout(()=>{
                    navigate("/");
                },5000);
            }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    
    const getDashboardDataAPI=()=>{
        getTotalFilesAPI();
        getTotalProjectsAPI();
        getTotalDownloadsAPI();
        getTotalContributorAPI();
        getTotalViewerAPI();
    }

    const getDashboardDataOtherAPI=()=>{
        getTotalFilesAPI();
        getTotalProjectsAPI();
        getTotalDownloadsAPI();
    }

    const files = Object.entries(dash).reduce((acc, [key, value]) => {
        acc[key] = parseInt(value, 10); // Convert string to integer
        return acc;
      }, {});
      //console.log(files);

      const project = Object.entries(projects).reduce((acc, [key, value]) => {
        acc[key] = parseInt(value, 10); // Convert string to integer
        return acc;
      }, {});
    //console.log(project);
    

    useEffect(()=>{
        if((permissions!==null) && (permissions.is_admin_user==="Y")){getDashboardDataAPI()}
        else if (permissions!==null) {getDashboardDataOtherAPI()}
    //((permissions!==null) && (permissions.is_admin_user==="Y" || permissions.is_admin_user==="N")) ? getDashboardDataAPI(): navigate("/dashboard")
    },[]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow overflow-y-auto"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                <Breadcrumb crumbs={crumbs} />
                    {/* <h1 className="text-xl font-bold mb-4 text-center">Dashboard</h1> */}
                    <div className="bg-gray-800 shadow-lg rounded-lg p-2 text-center mt-8">
                        <p className="font-bold text-cyan-400 text-xl underline">Dashboard</p>
                    </div>
                    <div className="container flex flex-col max-h-[1000vh]">
                        <div className="flex-grow overflow-y-auto mb-6 text-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
                                {(permissions !== null && permissions.is_admin_user ==="N" ) ? 
                                <>
                                    {/* Card 1 */}
                                    <div className="bg-green-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-buildings-fill" viewBox="0 0 16 16"><path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zM2 11h1v1H2zm2 0h1v1H4zm-1 2v1H2v-1zm1 0h1v1H4zm9-10v1h-1V3zM8 5h1v1H8zm1 2v1H8V7zM8 9h1v1H8zm2 0h1v1h-1zm-1 2v1H8v-1zm1 0h1v1h-1zm3-2v1h-1V9zm-1 2h1v1h-1zm-2-4h1v1h-1zm3 0v1h-1V7zm-2-2v1h-1V5zm1 0h1v1h-1z"/></svg></span>
                                        <h2 className="font-bold text-xl text-green-800">Total Active Projects</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(project.total_active_projects) ? "No Data" : project.total_active_projects }</p>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="bg-yellow-500 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-image-fill" viewBox="0 0 16 16"><path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total IMAGE files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_image_files) ? "No Data" : files.total_image_files}</p>
                                    </div>
                                    {/* Card 3 */}
                                    <div className="bg-red-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-buildings" viewBox="0 0 16 16"><path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z"/><path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z"/></svg></span>
                                        <h2 className="font-bold text-xl text-red-800">Total In-Active Projects</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(project.total_inactive_projects) ? "No Data" : project.total_inactive_projects}</p>
                                    </div>
                                    {/* Card 4 */}
                                    <div className="bg-indigo-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-file-pdf-fill" viewBox="0 0 16 16"><path d="M5.523 10.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 4.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/><path fillRule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.6 11.6 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total PDF files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_pdf_files) ? "No Data" : files.total_pdf_files}</p>
                                    </div>
                                    {/* Card 5 */}
                                    <div className="bg-teal-400 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total Files Downloaded</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(down.total_download) ? "No Data" : down.total_download}</p>
                                    </div>
                                    {/* Card 6 */}
                                    <div className="bg-pink-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-file-earmark-medical" viewBox="0 0 16 16"><path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total DWG files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_drawing_files) ? "No Data" : files.total_drawing_files}</p>
                                    </div>
                                </>
                                :
                                <>
                                    {/* Card 1 */}
                                    <div className="bg-green-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-buildings-fill" viewBox="0 0 16 16"><path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zM2 11h1v1H2zm2 0h1v1H4zm-1 2v1H2v-1zm1 0h1v1H4zm9-10v1h-1V3zM8 5h1v1H8zm1 2v1H8V7zM8 9h1v1H8zm2 0h1v1h-1zm-1 2v1H8v-1zm1 0h1v1h-1zm3-2v1h-1V9zm-1 2h1v1h-1zm-2-4h1v1h-1zm3 0v1h-1V7zm-2-2v1h-1V5zm1 0h1v1h-1z"/></svg></span>
                                        <h2 className="font-bold text-xl text-green-800">Total Active Projects</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(project.total_active_projects) ? "No Data" : project.total_active_projects }</p>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="bg-yellow-500 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-image-fill" viewBox="0 0 16 16"><path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total IMAGE files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_image_files) ? "No Data" : files.total_image_files}</p>
                                    </div>
                                    {/* Card 3 */}
                                    <div className="bg-red-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-buildings" viewBox="0 0 16 16"><path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z"/><path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z"/></svg></span>
                                        <h2 className="font-bold text-xl text-red-800">Total In-Active Projects</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(project.total_inactive_projects) ? "No Data" : project.total_inactive_projects}</p>
                                    </div>
                                    {/* Card 4 */}
                                    <div className="bg-indigo-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-file-pdf-fill" viewBox="0 0 16 16"><path d="M5.523 10.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 4.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/><path fillRule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.6 11.6 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total PDF files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_pdf_files) ? "No Data" : files.total_pdf_files}</p>
                                    </div>
                                    {/* Card 5 */}
                                    <div className="bg-gray-500 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16"><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/><path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total Contributors</h2>
                                        <p className="font-bold text-2xl">{contributor.total_contributors}</p>
                                    </div> 
                                    {/* Card 6 */}
                                    <div className="bg-pink-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-file-earmark-medical" viewBox="0 0 16 16"><path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total DWG files</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(files.total_drawing_files) ? "No Data" : files.total_drawing_files}</p>
                                    </div>
                                    {/* Card 7 */}
                                    <div className="bg-orange-300 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-binoculars-fill" viewBox="0 0 16 16"><path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total Viewers</h2>
                                        <p className="font-bold text-2xl">{viewer.total_viewers}</p>
                                    </div>
                                    {/* Card 8 */}
                                    <div className="bg-teal-400 shadow-lg rounded-lg p-4 my-2 mx-16">
                                        <span className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fillRule="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/></svg></span>
                                        <h2 className="font-bold text-xl text-white">Total Files Downloaded</h2>
                                        <p className="font-bold text-2xl">{Number.isNaN(down.total_download) ? "No Data" : down.total_download}</p>
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

  };


  export default Dashboard;