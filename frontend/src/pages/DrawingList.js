import DataTable from 'react-data-table-component';
import {  useNavigate} from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from '../components/breadcrump';

//import { useAuth } from "../AuthContext";

const DrawingList = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [draw, setDraw]=useState([]);
    const [search, setSearch]=useState('');
    const [filter, setFilter]=useState([]);
    const navigate = useNavigate();
    //let data=JSON.parse(localStorage.getItem("UserData"));
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    
    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Drawing', path: '/drawinglist' }
    ]

    const getDrawingListAPI=()=>{
        axios.get(`${baseUrl}/drawing/getdrawinglist`,{ 
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
                setDraw(response.data.data);
                setFilter(response.data.data);
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

    
    useEffect(()=>{
       ((permissions!==null) && (permissions.is_admin_user==="Y" || permissions.is_admin_user==="N")) ? getDrawingListAPI(): navigate("/dashboard")
    },[]);


    useEffect(()=>{
        const result=draw.filter((item)=>{
            if(item.drawing_description.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.drawing_description
            }
            else if(item.category_name.toLowerCase().match(search.toLocaleLowerCase())) {
                return item.category_name
            }
            else if((item.project_code+ "-"+ item.drawing_number).toLowerCase().match(search.toLocaleLowerCase())) {
                return item.drawing_number
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

    const handelDrawingDetail= (row)=>{
        navigate("/drawingdetail", {state:{row}});
    }

    const handelDrawingEdit=(row)=>{
        navigate("/drawingedit", {state:{row}});
    }

    const handelDrawingDelete = (id) =>{
        //console.log(id);
        axios.get(`${baseUrl}/drawing/deletedrawing/${id}`,
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true}})
            .then(response => 
                {
                    if(response.data.status==="success")
                    {
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        getDrawingListAPI();
                    }
                    else if((response.data.status==="error") && (response.data.message==="Invalid token"))
                    {
                        toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
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

    const handelStatus=(id)=>{
        //console.log(id);
        axios.get(`${baseUrl}/drawing/updatedrawingstatus/${id}`,
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true}})
            .then(response => 
                {
                    if(response.data.status==="success")
                    {
                        toast.success(response.data.message,{position:"top-center", duration: 5000});
                        getDrawingListAPI();
                    }
                    else if((response.data.status==="error") && (response.data.message==="Invalid token"))
                    {
                        toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
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


    const columnsAdmin = [
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
            selector: row => row.drawing_description,
            sortable: true,
            wrap: true,
        },
        {
            name: 'DRG No',
            selector: row => row.project_code+ "-"+ row.drawing_number,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.drawing_type,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Revision No',
            selector: row => row.drawing_revision_number,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            cell: (row) =>  
                        {if(row.drawing_is_active==="Y"){return(<label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={false} id={row.drawing_id} className="sr-only peer" onChange={()=>handelStatus(row.drawing_id)}/>
                        <div className="w-11 h-6 bg-green-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:bg-red-500 transition-colors duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </label>)}
                       
                        else{return(<label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id={row.drawing_id} className="sr-only peer" onChange={()=>handelStatus(row.drawing_id)}/>
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
                    <button type='button' className='bg-orange-400 rounded px-2 py-1 mx-1' title="Detail" onClick={()=>handelDrawingDetail(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                    </button>

                    <button type='button' className='bg-cyan-500 rounded px-2 py-1 mx-1' title="Edit" onClick={()=>handelDrawingEdit(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </button>

                    <button type='button' className='bg-red-400 rounded px-2 py-1 mx-1' title="Delete" onClick={() => {if(window.confirm('Are you sure you want to delete this Drawing ?')){handelDrawingDelete(row.drawing_id)}}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>
                    </button>
                </>
            )
        },
    ]


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
            selector: row => row.drawing_description,
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
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Type',
            selector: row => row.drawing_type,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Revision No',
            selector: row => row.drawing_revision_number,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row =>{if(row.drawing_is_active==="Y"){return(<div className="text-green-400 text-pretty">Active</div>)}
                            else{return(<div className="text-red-500">In-Active</div>)}},
            sortable: true,
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
                    <button type='button' className='bg-orange-400 rounded px-2 py-1 mx-1' title="Detail" onClick={()=>handelDrawingDetail(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                    </button>
                    {row.drawing_can_edit==="Y" ? 
                    <button type='button' className='bg-cyan-500 rounded px-2 py-1 mx-1' title="Edit" onClick={()=>handelDrawingEdit(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </button> : 
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
                            {(permissions!==null && permissions.is_admin_user==="Y") ? 
                            <>
                                <DataTable
                                    title="Drawing List"
                                    columns={columnsAdmin}
                                    data={filter}
                                    className="border border-gray-200"
                                    customStyles={customStyle}
                                    striped
                                    highlightOnHover
                                    actions={
                                        <>
                                            <input type='text' className='mb-2  outline outline-1 outline-gray-400 rounded-md' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        </>
                                    }
                                />
                            </>
                            :
                            <>
                                <DataTable
                                    title="Drawing List"
                                    columns={columns}
                                    data={filter}
                                    className="border border-gray-200"
                                    customStyles={customStyle}
                                    striped
                                    highlightOnHover
                                    actions={
                                        <>
                                            <input type='text' className='mb-2 outline outline-1 outline-gray-400 rounded-md' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        </>
                                    }
                                />
                            </>}
                        </div>
                    </div>
                </div>
                <ToastContainer/>
            </div>
            <Footer/>
        </div>
    );
  };

  export default DrawingList;