import DataTable from 'react-data-table-component';
import {  useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from '../components/breadcrump';

//import { useAuth } from '../AuthContext';


const DownloadHistory = () => {
    
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [downloadHistory, setDownloadHistory]=useState([]);
    const [search, setSearch]=useState('');
    const [filter, setFilter]=useState([]);
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    //console.log(Atoken);
    //console.log(permissions);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Download Log', path: '/downloadlog' }
    ]

    const getDownloadHistoryAPI=()=>{
        axios.get(`${baseUrl}/report/getdownloadlist`,{ 
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
                        setDownloadHistory(response.data.data);
                        setFilter(response.data.data);
                    }
            else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
                    {
                        toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
                        setTimeout(()=>{
                            navigate("/");
                        },5000);
                    }
            else    {
                        toast.error(response.data.message,{position:"top-center"})
                    }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    
    useEffect(()=>{
        (permissions!==null && permissions.can_view_download_logsheet) ? getDownloadHistoryAPI(): navigate("/dashboard")
    },[]);

    useEffect(()=>{
        const result=downloadHistory.filter((item)=>{
            if(item.user_name.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.user_name
            }
            else if((item.project_code+ "-"+ item.drawing_number).toLowerCase().match(search.toLocaleLowerCase())) {
                return item.drawing_number
            }
            else if((item.drawing_description).toLowerCase().match(search.toLocaleLowerCase())) {
                return item.drawing_description
            }
            else if((item.download_reason).toLowerCase().match(search.toLocaleLowerCase())) {
                return item.download_reason
            }
             return null;
        });
        setFilter(result);
    },[search]);


    const customStyle={
        headCells:{
            style:{
                backgroundColor: "black",
                color: "gray",
                fontSize: "18px",
                fontWeight: "bolder",
            }
        },
    }


    const columns = [
        {
            name: 'Sl No',
            //selector: row => row.site_id,
            selector: (row,index) => index + 1,
            sortable: false,
            style: {
                justifyContent: "left",
              },
        },
        {
            name: 'User Name',
            selector: row => row.user_name,
            //cell: (row) => <div className="border border-gray-900 p-2">{row.project_name}</div>,
            sortable: true,
            wrap: true,
        },
        {
            name: 'DRG No',
            selector: row =>row.project_code+ "-"+ row.drawing_number,
            sortable: true,
            wrap: true,
        },
        {
            name: 'DRG Description',
            selector: row => row.drawing_description,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Downloaded On',
            selector: row =>  new Date(row.download_on).toLocaleString(),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Purpose',
            selector: row => row.download_reason,
            sortable: true,
            wrap: true,
        },
    ]


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow overflow-y-auto"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                    <Breadcrumb crumbs={crumbs} />
                    <div className="container flex flex-col max-h-[1000vh]">
                        <div className="flex-grow overflow-y-auto my-4">
                            <DataTable
                                title="Download Log / History"
                                columns={columns}
                                data={filter}
                                className="border border-gray-200"
                                customStyles={customStyle}
                                striped
                                highlightOnHover
                                // subHeader
                                // subHeaderComponent={
                                //     <input type='text' className='inline-block border-gray-800 mb-2' placeholder='Search...' value={''} onChange={''}/>
                                // }
                                // subHeaderAlign='right'
                                actions={
                                    <>
                                    <input type='text' className='mb-2  outline outline-1 outline-gray-400 rounded-md' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                    </>
                                }
                            />
                        </div>
                    </div>
                </div>
                <ToastContainer/>
            </div>
            <Footer/>
        </div>
    );
  };

  export default DownloadHistory;