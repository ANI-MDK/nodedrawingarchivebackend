import {  useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

//import { useAuth } from "../AuthContext";

const DrawingEdit = () => {
    //const { token, userData } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Drawing', path: '/drawinglist' },
        { label: 'Edit Drawing', path: '/drawingedit' }
    ]
    
    const {state}= useLocation(); 
    let data={}; 
    data=(state!==null? state.row : "")
    //console.log(data);
    const initialData = {DRG:data.drawing_number, category:data.category_id, sub:data.sub_category_id, type:data.drawing_type,  desc:data.drawing_description, revision_no:(data.drawing_revision_number==="0"? "":data.drawing_revision_number),pg_no:data.page_number};
    
    const [draw, setDraw]=useState(initialData);
    const [project, setProject]=useState([]);
    const [pro, setPro]=useState(data.project_id + "/"+data.project_code);
    const [drg, setDrg]=useState(data.project_code);

    const today = new Date().toISOString().split('T')[0];
    let drgDate="";
    let revDate="";
    if(data.drawing_passed_date){drgDate=data.drawing_passed_date.split('T')[0]};
   if(data.drawing_revision_date){revDate=data.drawing_revision_date.split('T')[0]};

    const [passDate, setPassDate]=useState(drgDate);
    const [revisionDate, setRevisionDate]=useState(revDate);

    const [sub, setSub]=useState([]);
    const [category, setCategory]=useState([]);

    const fileInputRefImg = useRef(null);
    const fileInputRefPdf = useRef(null);
    const fileInputRefDwg = useRef(null);

    const [loader, setLoader]=useState(false);

    let files=[];
    if(data.drawing_file_details){files = data.drawing_file_details.split(", ")};
    let imgId = 0;
    let imgType = "";
    let imgName = "";
    let pdfId = 0;
    let pdfType = "";
    let pdfName = "";
    let dwgId = 0;
    let dwgType = "";
    let dwgName = "";
    files.map((file) => {
        const [id, type, name] = file.split("|~|");
        switch(type) {
            case "PNG":
            case "JPG":
            case "JPEG":    imgId = id;
                            imgType = type;
                            imgName =name;
                            break;

            case "PDF":     pdfId = id;
                            pdfType = type;
                            pdfName = name;
                            break;

            case "DWG":     dwgId = id;
                            dwgType = type;
                            dwgName = name;
                            break;
        }
    })
    
    //console.log("Img Data---"+"{"+"id:"+imgId,"type:"+imgType,"name:"+imgName+"}"+"//","Pdf Data--"+"{"+"id:"+pdfId,"type:"+pdfType,"name:"+pdfName+"}"+"//","{"+"Dwg Data--"+"{"+"id:"+dwgId,"type:"+dwgType,"type:"+dwgName+"}")
    
    const [img, setImg]=useState('');
    const [pdf, setPdf]=useState('');
    const [dwg, setDwg]=useState('');
    const navigate = useNavigate();
    const Atoken = JSON.parse(localStorage.getItem('token'));
    //console.log(Atoken);    

    const getUserSpeceficProjectListAPI=()=>{
        axios.get(`${baseUrl}/project/getactiveprojectlist/can_edit`,{ 
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

    const getDrawingCategoryListAPI=()=>{
        axios.get(`${baseUrl}/category/getcategory/edit/${data.project_id}`,{ 
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
            // else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            // {
            //     toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
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

    const getDrawingSubCategoryListAPI=()=>{
        axios.get(`${baseUrl}/category/getsubcategory/edit/${data.project_id}`,{ 
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
                setSub(response.data.data);
            }
            // else if((response.data.status==="error")&& (response.data.message==="Invalid token"))
            // {
            //     toast.error("Your session has expired. Please Login again.",{position:"top-center", duration: 5000});
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

    const apiCall= ()=>{
        getUserSpeceficProjectListAPI();
        getDrawingCategoryListAPI();
        getDrawingSubCategoryListAPI();
    }

    useEffect(()=>{
        (state===null) ? navigate("/dashboard"): apiCall();
    },[]);

    const Options=({options})=>{
        if(undefined !== options) {
            return(
                options.map((option,i) => 
                    (<option key={i} id={option.project_id} value={option.project_id + "/"+option.project_code }>{option.project_name}</option>))
            );
        }
    }

    const Cat=({options})=>{
        if(undefined !== options) {
            return(
                options.map(option => 
                    (<option key={option.category_id} value={option.category_id}>{option.category_name}</option>))
            );
        }
    }

    const Sub=({options})=>{
        if(undefined !== options) {
            return(
                options.map(option => 
                    (<option key={option.sub_category_id} value={option.sub_category_id}>{option.sub_category_name}</option>))
            );
        }
    }


    const handleDrawingAddChange=(e)=>{
        const{ name, value} = e.target;
        setDraw({...draw, [name]:value});
    }

    const handelChange=(e)=>{
        const [v1, v2]=e.target.value.split("/");
        if(e.target.value === '')
        {
            setDrg('');
            setPro('');
        }
        else{
            setPro(e.target.value);
            const[v3]=v2.split("-");
            setDrg(v2);
        }
    }

    const handelDrawingEditSubmit= (e) =>{
        e.preventDefault();

        if(img.length===0 && pdf.length===0 && dwg.length===0 && (imgId===0 || (imgId!==0 && imgDel)) && (pdfId===0 || (pdfId!==0 && pdfDel)) && (dwgId===0 || (dwgId!==0 && dwgDel))){
            alert("Upload atleast any one of the file type in the Drawing Image Edit section")
        }
        else{
            const[id,val]=pro.split("/");
        
            let formData = new FormData();
             formData.append('project_id',id);
             formData.append('category_id',draw.category);
             formData.append('sub_category_id',draw.sub);
             formData.append('drawing_type',draw.type);
             formData.append('drawing_description',draw.desc);
             formData.append('drawing_number',draw.DRG);
             formData.append('drawing_page',draw.pg_no);
             formData.append('drawing_pass_date',passDate);
             formData.append('drawing_revision',draw.revision_no);
             formData.append('drawing_revision_date',revisionDate);
             formData.append('image_file',img);
             formData.append('pdf_file',pdf);
             formData.append('drawing_file',dwg);

             formData.append('is_delete_old_image',imgDel);
             formData.append('is_delete_old_pdf',pdfDel);
             formData.append('is_delete_old_drawing',dwgDel);
             formData.append('old_image_id',imgId);
             formData.append('old_pdf_id',pdfId);
             formData.append('old_drawing_id',dwgId);

            // for (let pair of formData.entries()) {
            //     console.log(`${pair[0]}: ${pair[1]}`);
            // }

            setLoader(true);

            axios.put(`${baseUrl}/drawing/updatedrawing/${data.drawing_id}`,formData,
                {headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${Atoken}`,
                    withCredentials:true
                        }
                })
                .then(response => 
                    {
                        //console.log(response);
                        setLoader(false);
                        if(response.data.status==="success")
                        {
                            toast.success(response.data.message,{position:"top-center", duration: 5000});
                            setTimeout(()=>{
                                navigate("/drawinglist");
                            },5000);  
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
       
    }

    const [imgFlag, setImgFlag]= useState(true);
    const [imgDel, setImgDel]= useState(false);
    const [pdfFlag, setPdfFlag]= useState(true);
    const [pdfDel, setPdfDel]= useState(false);
    const [dwgFlag, setDwgFlag]= useState(true);
    const [dwgDel, setDwgDel]= useState(false);


    const handelIMGFlag=()=>{
        setImgFlag(false);
        setImgDel(true);
    }

    const handelPDFFlag=()=>{
        setPdfFlag(false);
        setPdfDel(true);
    }

    const handelDWGFlag=()=>{
        setDwgFlag(false);
        setDwgDel(true);
    }


    const [imgMessage, setImgMessage] = useState(false);
    const handelImgChange=(e)=>{
        if (e.target.files[0]) {
            const extension = e.target.files[0].name.split('.').pop();
            //console.log(extension);
            if(extension==="png"||extension==="jpg"||extension==="jpeg"||extension==="PNG"||extension==="JPG"||extension==="JPEG")
            {
                setImg(e.target.files[0]);
                setImgMessage(false);
            }
            else{
                setImgMessage(true);
            }
          }
    }


    const [pdfMessage, setPdfMessage] = useState(false);
    const handelPdfChange=(e)=>{
        if (e.target.files[0]) {
            const extension = e.target.files[0].name.split('.').pop();
            //console.log(extension);
            if(extension==="pdf"||extension==="PDF")
            {
                setPdf(e.target.files[0]);
                setPdfMessage(false);
            }
            else{
                setPdfMessage(true);
            }
          }
    }


    const [dwgMessage, setDwgMessage] = useState(false);
    const handelDwgChange=(e)=>{
        if (e.target.files[0]) {
            const extension = e.target.files[0].name.split('.').pop();
            //console.log(extension);
            if(extension==="dwg"||extension==="DWG")
            {
                setDwg(e.target.files[0]);
                setDwgMessage(false);
            }
            else{
                setDwgMessage(true);
            }
          }
    }


    const truncateFileName=(fileName, maxLength = 12) => {
        const extensionIndex = fileName.lastIndexOf(".");
        const name = fileName.substring(0, extensionIndex);
        const extension = fileName.substring(extensionIndex);
      
        if (name.length > maxLength) {
          return name.substring(0, maxLength) + "..." + extension;
        }
        return fileName; // If it's not too long, return the full file name
    }



    const handelImg=()=>{
        setImg('');
        fileInputRefImg.current.value = '';
        setImgMessage(false);
    }

    const handelPdf=()=>{
        setPdf('');
        fileInputRefPdf.current.value = '';
        setPdfMessage(false);
    }

    const handelDwg=()=>{
        setDwg('');
        fileInputRefDwg.current.value = '';
        setDwgMessage(false);
    }

    const handelRefresh=()=>{
        window.location.reload();
    }
    const handleBackClick=()=>{
        navigate("/drawinglist");
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow mb-8"> 
                <div className="container mx-auto px-4 py-2 sm:mt-16 md:mt-16 lg:mt-4 xl:-mt-6">
                    <Breadcrumb crumbs={crumbs}/>
                    <div className="container max-h-[1000vh] overflow-y-auto">
                        <div className="container mt-8">
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-5xl bg-cyan-700 bg-opacity-70 shadow-lg rounded-lg p-5">
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Drawing Detail Edit Section:</h3>
                                    <form onSubmit={handelDrawingEditSubmit}>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="project" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Project Name:</label>
                                                    <select name="project" value={pro} onChange={(e)=>handelChange(e)} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required>
                                                        <option key="" value="">--Please select Project here--</option>
                                                        <Options options={project} />
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="DRG" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Drawing Number:</label>
                                                    <input type="text" value={drg} className="mt-1 p-2 w-1/4 mr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" readOnly/>-
                                                    <input type="text" id="DRG" name="DRG" value={draw.DRG} placeholder="Enter Drawing No. here" onChange={handleDrawingAddChange} className="mt-1 p-2 w-2/3 ml-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Category:</label>
                                                    <select id="category" name="category" value={draw.category} onChange={handleDrawingAddChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required>
                                                        <option value="">--Please select Category here--</option>
                                                        <Cat options={category} />
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="sub" className="block text-sm font-medium text-gray-700">Sub-Category:</label>
                                                    <select id="sub" name="sub" value={draw.sub} onChange={handleDrawingAddChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
                                                        <option value="">--Please select Sub-Category here--</option>
                                                        <Sub options={sub} />
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Drawing Type:</label>
                                                    <select id="type" name="type" value={draw.type} onChange={handleDrawingAddChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required>
                                                        <option value="">--Please select Category here--</option>
                                                        <option value="Detail">Detail</option>
                                                        <option value="GA">GA</option>
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-1">
                                                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Drawing Description:</label>
                                                    <textarea rows="1" id="desc" name="desc" maxLength="500" value={draw.desc} placeholder="Enter Drawing Description here, maximum 500 character" onChange={handleDrawingAddChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div>

                                            {/* <div className="flex flex-wrap -mx-3">
                                                <div className="w-full px-3">
                                                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Drawing Description:</label>
                                                    <textarea id="desc" name="desc" maxLength="500" value={draw.desc} placeholder="Enter Drawing Description here, maximum 500 character" onChange={handleDrawingAddChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required/>
                                                </div>
                                            </div> */}
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-1/4 px-3 mb-1">
                                                    <label htmlFor="pg_no" className="block text-sm font-medium text-gray-700"><span className="text-red-500">*</span>Drawing Page Number:</label>
                                                    <input type="number" placeholder="enter page number if any" id="pg_no" name="pg_no" min="1" value={draw.pg_no} onChange={handleDrawingAddChange} className="mt-1 p-2 w-full mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required={revisionDate ? 1 : 0}/>
                                                </div>
                                                <div className="w-1/4 px-3 mb-1">
                                                    <label htmlFor="DRG-Date" className="block text-sm font-medium text-gray-700">Drawing Pass Date:</label>
                                                    <div className="w-full mt-1">
                                                        <input type="date" value={passDate} max={today} onChange={(e)=>setPassDate(e.target.value)} className="w-4/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"/>
                                                        {passDate === "" ? "" :
                                                        <button type="button" onClick={()=>setPassDate('')} className="ml-2 p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                        </button>}
                                                    </div>
                                                </div>
                                                <div className="w-1/4 px-3 mb-1">
                                                    <label htmlFor="Revision_Date" className="block text-sm font-medium text-gray-700">Drawing Revision Date:</label>
                                                    <div className="w-full mt-1">
                                                        <input type="date" value={revisionDate} max={today} onChange={(e)=>setRevisionDate(e.target.value)} className="w-4/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"/>
                                                        {revisionDate === "" ? "" :
                                                        <button type="button" onClick={()=>setRevisionDate('')} className="ml-2 p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                        </button>}
                                                    </div>
                                                </div>
                                                <div className="w-1/4 px-3 mb-1">
                                                    <label htmlFor="revision" className="block text-sm font-medium text-gray-700">{revisionDate?<span className="text-red-500">*</span>:""}Drawing Revision Number:</label>
                                                    <input type="text" placeholder="enter number greater than 0 if any" id="revision_no" name="revision_no" value={draw.revision_no} onChange={handleDrawingAddChange} className="mt-1 p-2 w-full mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" required={revisionDate ? 1 : 0}/>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h3 className="block text-lg font-medium text-gray-700 mb-1 mt-4">Drawing Image Edit Section:</h3>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-1/3 px-3">
                                                    {imgFlag ? 
                                                    <>
                                                        {imgType==="" ?
                                                        <>
                                                            <label htmlFor="image" className="block ml-2 text-sm font-medium text-gray-700">Upload JPEG/PNG/JPG file:</label>
                                                            <input type="file" ref={fileInputRefImg} name="image" className="mt-1 p-2 w-3/4" accept="image/jpeg, image/png" onChange={handelImgChange}/>
                                                            {img === '' || img === undefined ? '' :<button type="button" onClick={handelImg} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button>}
                                                            {imgMessage ?<span className="block text-red-500 text-sm mx-auto">Upload PNG, JPG, JPEG file type only</span>:""}
                                                        </>:
                                                        <>
                                                            <label htmlFor="image" className="block ml-2 text-sm font-medium text-gray-700 underline">Uploaded Image file</label>
                                                            <label htmlFor="image" className="inline-block ml-2 mr-2 text-md font-medium text-gray-700 mt-2">{imgName===""?<>Click<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 -mt-1 inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg> to choose new file</>: truncateFileName(imgName)}</label><button type="button" onClick={()=>{if(window.confirm('Are you sure you want to delete this File ?'))handelIMGFlag()}} className="px-2 py-1 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button> 
                                                        </>}
                                                    </>:
                                                    <>
                                                        <label htmlFor="image" className="block ml-2 text-sm font-medium text-gray-700">Upload JPEG/PNG/JPG file:</label>
                                                        <input type="file" ref={fileInputRefImg} name="image" className="mt-1 p-2 w-3/4" accept="image/jpeg, image/png" onChange={handelImgChange}/>
                                                        {img === '' || img === undefined ? '' :<button type="button" onClick={handelImg} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                        </button>}
                                                        {imgMessage ?<span className="block text-red-500 text-sm mx-auto">Upload PNG, JPG, JPEG file type only</span>:""}
                                                    </>}
                                                </div>
                                                <div className="w-1/3 px-3">
                                                    {pdfFlag ?
                                                    <>
                                                        {pdfType==="" ? 
                                                        <>
                                                            <label htmlFor="pdf" className="block ml-2 text-sm font-medium text-gray-700">Upload PDF file:</label>
                                                            <input type="file" ref={fileInputRefPdf} name="pdf" className="mt-1 p-2 w-3/4" accept=".pdf" onChange={handelPdfChange}/>
                                                            {pdf ===''|| pdf === undefined ? '' :<button type="button" onClick={handelPdf} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button>}
                                                            {pdfMessage ?<span className="block text-red-500 text-sm mx-auto">Upload PDF file type only</span>:""}
                                                        </>:
                                                        <>
                                                            <label htmlFor="pdf" className="block ml-2 text-sm font-medium text-gray-700 underline">Uploaded PDF file</label>
                                                            <label htmlFor="pdf" className="inline-block ml-2 mr-2 text-md font-medium text-gray-700 mt-2">{pdfName===""?<>Click<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 -mt-1 inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg> to choose new file</>: truncateFileName(pdfName)}</label><button type="button" onClick={()=>{if(window.confirm('Are you sure you want to delete this File ?'))handelPDFFlag()}} className="px-2 py-1 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button>
                                                        </>} 
                                                    </> :
                                                    <>
                                                        <label htmlFor="pdf" className="block ml-2 text-sm font-medium text-gray-700">Upload PDF file:</label>
                                                        <input type="file" ref={fileInputRefPdf} name="pdf" className="mt-1 p-2 w-3/4" accept=".pdf" onChange={handelPdfChange}/>
                                                        {pdf ===''|| pdf === undefined ? '' :<button type="button" onClick={handelPdf} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                        </button>}
                                                        {pdfMessage ?<span className="block text-red-500 text-sm mx-auto">Upload PDF file type only</span>:""}
                                                    </>}
                                                </div>
                                                <div className="w-1/3 px-3">
                                                    {dwgFlag ?
                                                    <> 
                                                        {dwgType==="" ?
                                                        <>
                                                            <label htmlFor="dwg" className="block ml-2 text-sm font-medium text-gray-700">Upload DWG file:</label>
                                                            <input type="file" ref={fileInputRefDwg} className="mt-1 p-2 w-3/4" accept=".dwg" onChange={handelDwgChange}/>
                                                            {dwg ===''|| dwg === undefined ? '' :<button type="button" onClick={handelDwg} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button>}
                                                            {dwgMessage ?<span className="block text-red-500 text-sm mx-auto">Upload DWG file type only</span>:""}
                                                        </>:
                                                        <>
                                                            <label htmlFor="dwg" className="block ml-2 text-sm font-medium text-gray-700 underline">Uploaded DWG file</label>
                                                            <label htmlFor="dwg" className="inline-block ml-2 mr-2 text-md font-medium text-gray-700 mt-2">{dwgName===""?<>Click<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 -mt-1 inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg> to choose new file</>: truncateFileName(dwgName)}</label><button type="button" onClick={()=>{if(window.confirm('Are you sure you want to delete this File ?'))handelDWGFlag()}} className="px-2 py-1 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block bg-red-400 bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                            </button>
                                                        </>}
                                                    </>:
                                                    <>
                                                        <label htmlFor="dwg" className="block ml-2 text-sm font-medium text-gray-700">Upload DWG file:</label>
                                                        <input type="file" ref={fileInputRefDwg} className="mt-1 p-2 w-3/4" accept=".dwg" onChange={handelDwgChange}/>
                                                        {dwg ===''|| dwg === undefined ? '' :<button type="button" onClick={handelDwg} className="p-2 bg-red-400 rounded-md hover:bg-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
                                                        </button>}
                                                        {dwgMessage ?<span className="block text-red-500 text-sm mx-auto">Upload DWG file type only</span>:""}
                                                    </>}
                                                </div>
                                            </div>
                                        </div>

                                        {loader ? 
                                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                                            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-yellow-400"></div>
                                        </div>
                                        : "" }
                                        
                                        <div className="mt-4">
                                            <input type="submit" value="Save" className="inline-block text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-500 dark:border-green-900 mr-2 cursor-pointer"/>
                                            <button type="button" className="inline-blockfocus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-8 py-2.5 me-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900 mr-2" onClick={handelRefresh}>Refresh</button>
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

  export default DrawingEdit;