import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {  useLocation, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from '../components/breadcrump';

//import { useAuth } from "../AuthContext";

const UserPermission = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate=useNavigate();
    const [projects, setProjects] = useState([]);
    const {state}= useLocation();
    let data={}; 
    data=(state!==null? state.row : "")
    //console.log(data);
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'User', path: '/userlist' },
        { label: 'User Permission', path: '/userpermission' }
    ]

    const getUserProjectListAPI=()=>{
        axios.get(`${baseUrl}/user/getuserpermission/${data.user_id}`,{ 
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
                setProjects(response.data.data);
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
        (permissions!==null && permissions.is_admin_user==="Y") ? getUserProjectListAPI(): navigate("/dashboard")
    },[]);


    const handlePermissionChange = (projectId, permissionType, e) => {
        let val= (e.target.checked) ? 'Y' : 'N';
        //console.log(projectId,permissionType, val);
        
        axios.post(`${baseUrl}/user/setuserpermission`,{user_id:data.user_id,project_id:projectId,field_name:permissionType,field_value:val},
            {headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Atoken}`,
                withCredentials:true}})
            .then(response => 
                {
                    //console.log(response);
                    if(response.data.status==="success")
                    {
                        getUserProjectListAPI();
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
    };

    const customStyle={
        headCells:{
            style:{
                backgroundColor: "black",
                color: "white",
                fontSize: "18px",
                fontWeight: "bolder",
            }
        },
    }

    const columns = [
        {
            name: 'Sl No',
            selector: (row,i) => i + 1,
            sortable: false,
            //width: "9rem",
            style: {
                justifyContent: "left",
              },
        },
        {
            name: 'Project Name',
            selector: (row) => row.project_name,
            sortable: false,
        },
        {
            name: 'View',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.can_view==="N"? false : true}
                    onChange={(e) => handlePermissionChange(row.project_id, 'can_view', e)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Add',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.can_add==="N" ? false : true}
                    onChange={(e) => handlePermissionChange(row.project_id, 'can_add', e)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Edit',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.can_edit==="N" ? false : true}
                    onChange={(e) => handlePermissionChange(row.project_id, 'can_edit', e)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Download',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.can_download==="N" ? false : true}
                    onChange={(e) => handlePermissionChange(row.project_id, 'can_download', e)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'View Log',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.can_view_download_logsheet==="N" ? false : true}
                    onChange={(e) => handlePermissionChange(row.project_id, 'can_view_download_logsheet', e)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return(
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow overflow-y-auto-auto"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                    <Breadcrumb crumbs={crumbs}/>
                    <div className="container flex flex-col max-h-[1000vh]">
                        <div className="flex-grow overflow-y-auto my-4">
                            <DataTable
                                title={`Set Permission for ${data.user_name}`}
                                columns={columns}
                                data={projects}
                                className="border border-gray-200"
                                customStyles={customStyle}
                                striped
                                highlightOnHover
                                actions={
                                    <Link to="/userlist"><button type='button' className='focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-500 dark:hover:bg-gray-400 dark:focus:ring-gray-400'>Back</button></Link>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default UserPermission;