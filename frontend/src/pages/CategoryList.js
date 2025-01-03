import DataTable from 'react-data-table-component';
import {  useNavigate} from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from '../components/breadcrump';

//import { useAuth } from "../AuthContext";

const CategoryList = () => {
    //const { token, userData } = useAuth();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate= useNavigate();
    const [category, setCategory]=useState([]);
    const [subCategory, setSubCategory]=useState([]);
    
    const Atoken = JSON.parse(localStorage.getItem('token'));
    const permissions=JSON.parse(localStorage.getItem('UserData'));

    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Category', path: '/categorylist' }
    ]


    useEffect(()=>{
        (permissions!==null && permissions.is_admin_user==="Y") ? apiData(): navigate("/dashboard")
    },[]);


    const apiData=()=>{
        getCategoryListAPI();
        getSubCategoryListAPI();
    }

    const getCategoryListAPI=()=>{
        axios.get(`${baseUrl}/category/getcategory`,{ 
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
                setCategory(response.data.data);
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

    
    const getSubCategoryListAPI=()=>{
        axios.get(`${baseUrl}/category/getsubcategory`,{ 
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
                setSubCategory(response.data.data);
            }
            // else if((response.data.status==="error") && (response.data.message==="Invalid token")){
            //     toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000})
            //     setTimeout(()=>{
            //         navigate("/");
            //     },5000);
            // }
            else{
                toast.error(response.data.message,{position:"top-center"})
            }
        })
        .catch(error => {
            toast.error(error,{position:"top-center"});
        });
    }

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
            selector: (row,i) => i + 1,
            sortable: false,
            //width: "9rem",
            style: {
                justifyContent: "left",
              },
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
            wrap: true,
        },
    ]

    const subColumns = [
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
            name: 'Sub-Category',
            selector: row => row.sub_category_name,
            //cell: (row) => <div className="border border-gray-900 p-2">{row.project_name}</div>,
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
                    <div className="container flex flex-row max-h-[1000vh]">
                        <div className="w-full md:w-1/2 px-1 mb-2">
                            <div className="flex-grow overflow-y-auto my-4">
                                <DataTable
                                    title="Category List"
                                    columns={columns}
                                    data={category}
                                    className="border border-gray-200"
                                    customStyles={customStyle}
                                    striped
                                    highlightOnHover
                                    // subHeader
                                    //     subHeaderComponent={
                                    //         <input type='text' className='border-slate-800 mb-2' placeholder='Search...' value={''} onChange={''}/>
                                    //     }
                                    //     subHeaderAlign='right'
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-2">
                            <div className="flex-grow overflow-y-auto my-4">
                                <DataTable
                                    title="Sub-Category List"
                                    columns={subColumns}
                                    data={subCategory}
                                    className="border border-gray-200"
                                    customStyles={customStyle}
                                    striped
                                    highlightOnHover
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
  };

  export default CategoryList;