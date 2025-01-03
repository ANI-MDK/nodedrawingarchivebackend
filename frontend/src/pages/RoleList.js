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


const RoleList = () => {
    //const { token, userData } = useAuth();
    //console.log(userData);
    //console.log(token);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [role, setRole]=useState([]);
    const [search, setSearch]=useState('');
    const [filter, setFilter]=useState([]);
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));
    //console.log(Atoken);
    //console.log(permissions);

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Role', path: '/rolelist' }
    ]

    const getRoleListAPI=()=>{
        axios.get(`${baseUrl}/role/getrolelist`,{ 
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
                        setRole(response.data.data);
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
        (permissions!==null && permissions.is_admin_user==="Y") ? getRoleListAPI(): navigate("/dashboard")
    },[]);

    useEffect(()=>{
        const result=role.filter((item)=>{
             if(item.role_name){return item.role_name.toLowerCase().match(search.toLocaleLowerCase())}
             return item;
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


    const handelRoleEdit=(row)=>{
        //console.log(row);
        navigate("/roleedit", {state:{row}});
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
            name: 'Name',
            selector: row => row.role_name,
            //cell: (row) => <div className="border border-gray-900 p-2">{row.project_name}</div>,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row =>{if(row.is_active==="Y"){return(<div className="text-green-400 text-pretty">Active</div>)}
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
                    <button type='button' className='bg-cyan-500 rounded px-2 py-1 mx-1' title="Edit" onClick={()=>handelRoleEdit(row)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </button>

                    {/* <button type='button' className='bg-red-400 rounded px-2 py-1 mx-1' title="Delete" onClick={() => {if(window.confirm('Are you sure you want to delete this Role?')){handelRoleDelete(row.role_id)}}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>
                    </button> */}
    
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
                                title="Role List"
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
                                    <input type='text' className='mr-8 mb-2  outline outline-1 outline-gray-400 rounded-md' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                    <Link to="/roleadd"><button type='button' className=' focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Add New</button></Link>
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

  export default RoleList;