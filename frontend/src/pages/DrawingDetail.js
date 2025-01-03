import {  useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Navbar from "../components/navbarNew";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrump";

const DrawingDetail = () => {
    
    const crumbs = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Drawing', path: '/drawinglist' },
        { label: 'Drawing Details', path: '/drawingdetail' }
    ]
    const navigate = useNavigate();
    const {state}= useLocation();
    //console.log(data);
    let data={}; 
    data=(state!==null? state.row : "")

    let drgDate="";
    let revDate="";
    if(data.drawing_passed_date){drgDate=data.drawing_passed_date}
    if(data.drawing_revision_date){revDate=data.drawing_revision_date}


    useEffect(()=>{
        if(state===null) navigate("/dashboard") 
    },[]);


    let files=[];
    if(data.drawing_file_details){files = data.drawing_file_details.split(", ")};
    // console.log(files);
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
        //console.log(file)
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
    //console.log("Img-"+imgId+imgType+imgName,"Pdf-"+pdfId+pdfType+pdfName,"Dwg-"+dwgId+dwgType+dwgName)


    // Shortening the file name if required
    const truncateFileName=(fileName, maxLength = 12) => {
        const extensionIndex = fileName.lastIndexOf(".");
        const name = fileName.substring(0, extensionIndex);
        const extension = fileName.substring(extensionIndex);
      
        if (name.length > maxLength) {
          return name.substring(0, maxLength) + "..." + extension;
        }
        return fileName; // If it's not too long, return the full file name
    }


    const handelDownload=(id,type,name)=>{
        navigate("/drawingdownload",{state:{state,id,type,name}});
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
                                <div className="w-full max-w-5xl bg-cyan-700 bg-opacity-70 shadow-lg rounded-lg p-5 my-2">
                                    <h3 className="block text-lg font-medium text-gray-700 mb-1">Drawing Details:</h3>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="name" className="text-md font-medium text-gray-700">Project Name:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_name}</label>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="number" className="text-md font-medium text-gray-700">Drawing Number:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.project_code+"-"+data.drawing_number}</label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="category" className="text-md font-medium text-gray-700">Category:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.category_name}</label>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="sub-category" className="text-md font-medium text-gray-700">Sub-Category:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.sub_category_name==='' ||data.sub_category_name===null  ? <span className="text-white">N/A</span>: data.sub_category_name}</label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="type" className="text-md font-medium text-gray-700">Drawing Type:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.drawing_type}</label>
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-2">
                                                    <label htmlFor="name" className="text-md font-medium text-gray-700">Drawing Description:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300 text-wrap break-words">{data.drawing_description}</label>
                                                </div>
                                            </div>

                                            {/* <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-full px-3 mb-2">
                                                    <label htmlFor="name" className="text-md font-medium text-gray-700">Drawing Description:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300 text-wrap break-words">{data.drawing_description}</label>
                                                </div>
                                            </div> */}
                                            <div className="flex flex-wrap -mx-3 mb-4">
                                                <div className="w-1/4 px-3 mb-2">
                                                    <label htmlFor="revision" className="text-md font-medium text-gray-700">Drawing Page Number:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.page_number}</label>
                                                </div>
                                                <div className="w-1/4 px-3 mb-2">
                                                    <label htmlFor="pass-date" className="text-md font-medium text-gray-700">Drawing Pass Date:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.drawing_passed_date==='' ||data.drawing_passed_date===null ? <span className="text-white">N/A</span> : drgDate}</label>
                                                </div>
                                                <div className="w-1/4 px-3 mb-2">
                                                    <label htmlFor="revision" className="text-md font-medium text-gray-700">Drawing Revision Number:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.drawing_revision_number}</label>
                                                </div>
                                                <div className="w-1/4 px-3 mb-2">
                                                    <label htmlFor="revision-date" className="text-md font-medium text-gray-700">Drawing Revision Date:</label>
                                                    <label className="block mt-1 p-1 w-full border border-gray-400 rounded-md bg-gray-300">{data.drawing_revision_date==='' ||data.drawing_revision_date===null ? <span className="text-white">N/A</span> : revDate}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="block text-lg font-medium text-gray-700 mb-1 mt-4">Uploaded Drawing Files:</h3>
                                        <div className="bg-gray-100 shadow-lg rounded-lg p-5 mb-2">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-1/3 px-3 text-center">
                                                    <label htmlFor="image" className="block text-md font-medium text-gray-700">Image file:</label>
                                                    {data.drawing_can_download === "Y" ? (imgType=="PNG" ||imgType=="JPG"||imgType=="JPEG") ? <button type="button" className="inline-block text-white bg-blue-400 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4"  onClick={()=>handelDownload(imgId,imgType,imgName)}>{truncateFileName(imgName)}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="currentColor" className="inline-block ml-4 bi bi-download mb-1" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg></button>: 
                                                    <button type="button" className="inline-block text-white bg-blue-400  font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4">No File</button>:
                                                    <button type="button" className="inline-block text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4" >{imgName==="" ? "No File": truncateFileName(imgName)}</button>}
                                                </div>
                                                <div className="w-1/3 px-3 text-center">
                                                    <label htmlFor="image" className="block text-md font-medium text-gray-700">PDF file:</label>
                                                    {data.drawing_can_download === "Y" ? (pdfType=="PDF") ? <button type="button" className="inline-block text-white bg-pink-400 hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4"  onClick={()=>handelDownload(pdfId,pdfType,pdfName)}>{truncateFileName(pdfName)}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="currentColor" className="inline-block ml-4 bi bi-download mb-1" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg></button>: 
                                                    <button type="button" className="inline-block text-white bg-pink-400  font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4">No File</button>:
                                                    <button type="button" className="inline-block text-white bg-pink-400 cursor-not-allowed font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4" >{pdfName==="" ? "No File": truncateFileName(pdfName)}</button>}
                                                </div>
                                                <div className="w-1/3 px-3 text-center">
                                                    <label htmlFor="image" className="block text-md font-medium text-gray-700">DWG file:</label>
                                                    {data.drawing_can_download === "Y" ? (dwgType=="DWG") ? <button type="button" id={dwgId} className="inline-block text-white bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4"  onClick={()=>handelDownload(dwgId,dwgType,dwgName)}>{truncateFileName(dwgName)}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="currentColor" className="inline-block ml-4 bi bi-download mb-1" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg></button>: 
                                                    <button type="button" className="inline-block text-white bg-yellow-400  font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4">No File</button>:
                                                    <button type="button" className="inline-block text-white bg-yellow-400 cursor-not-allowed font-medium rounded-lg text-md px-6 py-2.5 me-2 mx-4" >{dwgName==="" ? "No File": truncateFileName(dwgName)}</button>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button type="button" className="inline-block text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-10 py-2.5 me-2 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-800 mr-2"  onClick={handleBackClick}>Back</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
  };

  export default DrawingDetail;