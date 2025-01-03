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

const ProjectList = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [project, setProject]=useState([]);
    const [search, setSearch]=useState('');
    const [filter, setFilter]=useState([]);
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Project', path: '/projectlist' }
    ]

    const getProjectListAPI=()=>{
        axios.get(`${baseUrl}/project/getprojectlist`,{ 
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
                setProject(response.data.data);
                setFilter(response.data.data);
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
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

    useEffect(()=>{
        (permissions!==null && permissions.is_admin_user==="Y") ? getProjectListAPI(): navigate("/dashboard")
    },[]);
    
    useEffect(()=>{
        getProjectListAPI();
    },[]);

    useEffect(()=>{
        const result=project.filter((item)=>{
            if(item.project_name.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.project_name
            }
            else if(item.project_code.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.project_code
            }
            else if(item.project_state.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.project_state
            }
            else if(item.project_location.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.project_location
            }
            return null
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

    const handelProjectDetail=(row)=>{
        //console.log(row);
        navigate("/projectdetail", {state:{row}});
    }

    const handelProjectEdit=(row)=>{
        //console.log(row);
        navigate("/projectedit", {state:{row}});
    }

    const handelStatus=(id)=>{
        //console.log(id);

        axios.get(`${baseUrl}/project/updateprojectstatus/${id}`,
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true}})
            .then(response => 
                {
                    //console.log(response);
                    if(response.data.status==="success")
                    {
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        getProjectListAPI();
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


    const columns = [
        {
            name: 'Sl No',
            selector: (row,index) => index + 1,
            sortable: false,
            style: {
                justifyContent: "left",
              },
        },
        {
            name: 'Name',
            selector: row => row.project_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Code',
            selector: row => row.project_code,
            sortable: true,
            wrap: true,
        },
        {
            name: 'State',
            selector: row => row.project_state,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Location',
            selector: row => row.project_location,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            cell: (row) =>  
                            {if(row.project_is_active==="Y"){return(<label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={false} id={row.project_id} className="sr-only peer" onChange={()=>handelStatus(row.project_id)}/>
                                <div className="w-11 h-6 bg-green-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:bg-red-500 transition-colors duration-300"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                                </label>)}
                            // else{return(<label className="relative inline-flex items-center cursor-pointer">
                            //     <input type="checkbox" id={row.project_id} className="sr-only peer" onChange={()=>handelStatus(row.project_id)}/>
                            //     <div className="w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            //     <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:-translate-x-5"></div>
                            //     </label>)}},
                            else{return(<label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id={row.project_id} className="sr-only peer" onChange={()=>handelStatus(row.project_id)}/>
                            <div className="w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:-translate-x-5"></div>
                            </label>)}},
            sortable: false,
            wrap: true,
        },
        {
            name: 'Action',
            id: "name",
            // style: {
            //     justifyContent: "center",
            //   },
            cell:(row)=>(
                <>
                    <button type='button' className='bg-orange-400 rounded px-2 py-1 mx-1' title="Detail" onClick={()=>handelProjectDetail(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                    </button>

                    {(row.project_is_active==="Y") ?
                    <button type='button' className='bg-cyan-500 rounded px-2 py-1 mx-1' title="Edit" onClick={()=>handelProjectEdit(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </button>: 
                    <button type='button' className='bg-cyan-100 rounded px-2 py-1 mx-1 cursor-not-allowed' title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </button>}
                </>
            )
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
                                title="Project List"
                                columns={columns}
                                data={filter}
                                className="border border-gray-200"
                                customStyles={customStyle}
                                striped
                                highlightOnHover
                                // pagination
                                actions={
                                    <>
                                        <input type='text' className='mr-8 mb-2  outline outline-1 outline-gray-400 rounded-md' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        <Link to="/projectadd"><button type='button' className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Add New</button></Link>
                                    </>
                                }
                                // subHeader
                                //     subHeaderComponent={
                                //         <input type='text' className='border-slate-800 mb-2' placeholder='Search...' value={''} onChange={''}/>
                                //     }
                                //     subHeaderAlign='right'
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

  export default ProjectList;