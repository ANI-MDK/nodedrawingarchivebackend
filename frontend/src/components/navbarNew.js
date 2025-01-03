import { useState, useEffect } from 'react';
import {  Link, useNavigate } from "react-router-dom";
import Logout from './logout';
import packageJson from "../../package.json";
import IMG from "../assets/LOGO.png"
//import { useAuth } from '../AuthContext';
//import IMG1 from "../assets/ropeway7.jpg";


const Navbar = () => {

  const isAuthenticated = () => {
    return JSON.parse(localStorage.getItem('token'));
    };

  // const { token, userData } = useAuth(); 
 
  let data = isAuthenticated() ? JSON.parse(localStorage.getItem("UserData")) : null;
  //console.log(data);

  const [activeLink, setActiveLink] = useState(()=>{
    return window.location.pathname;
  });
  
  const navigate = useNavigate();

  useEffect(() => {
      if(data===null) {
        navigate("/")
      }
        const path = window.location.pathname;
        setActiveLink(path);
    }, []);
    
 
  return (
    <div className="container z-10">
      <header className="bg-cyan-600 text-white min-w-full fixed">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src={IMG} alt="Logo" className="object-cover h-14 w-40 ml-3"/>
          </div>

          {/* Middle: App Name */}
          <span className="text-4xl text-cyan-200 font-bold font-mono mr-4">Drawing Archive</span>

          {/* Right: Version */}
          <div className="text-sm  text-cyan-300 font-medium mr-6">Version {packageJson.version}</div>
        </div>
      </header>
      <nav className="bg-gray-800 text-gray-400 p-2 min-w-full fixed mt-14">
        <div className="container mx-auto flex justify-between items-center">
          <ul className="flex space-x-12 mx-4">
            <li><Link to="/dashboard" className={(activeLink==='/dashboard')?'text-cyan-400 text-md underline font-bold':''}>Dashboard</Link></li>
            {(data!==null && data.is_admin_user==="Y") ?
              <>
                {/* <li><Link to="/dashboard" className={(activeLink==='/dashboard')?'text-cyan-400 text-md underline font-bold':''}>Dashboard</Link></li> */}
                <li><Link to="/rolelist" className={(activeLink==='/rolelist'||activeLink==='/roleedit'||activeLink==='/roleadd')?'text-cyan-400 text-md underline font-bold':''}>Role</Link></li>
                <li><Link to="/projectlist" className={(activeLink==='/projectlist'||activeLink==='/projectedit'||activeLink==='/projectadd'||activeLink==='/projectdetail')?'text-cyan-400 text-md underline font-bold':''}>Project</Link></li>
                <li><Link to="/userlist" className={(activeLink==='/userlist'||activeLink==='/useredit'||activeLink==='/useradd'||activeLink==='/userdetail'||activeLink==='/userpassword'||activeLink==='/userpermission')?'text-cyan-400 text-md underline font-bold':''}>User</Link></li>
                <li><Link to="/categorylist" className={(activeLink==='/categorylist')?'text-cyan-400 text-md underline font-bold':''}>Category</Link></li>
              </> 
            : ""}
            <li><Link to="/drawinglist" className={(activeLink==='/drawinglist'||activeLink==='/drawingdetail'||activeLink==='/drawingedit'||activeLink==='/drawingdownload')?'text-cyan-400 text-md underline':''}>Drawing</Link></li>
            {(data!==null && data.can_add_drawing===0) ? "" : <li><Link to="/drawingadd" className={(activeLink==='/drawingadd')?'text-cyan-400 text-md underline font-bold':''}>Add Drawing</Link></li>}
            {(data!==null && data.can_view_download_logsheet===0) ? "" : <li><Link to="/downloadlog" className={(activeLink==='/downloadlog')?'text-cyan-400 text-md underline font-bold':''}>Download Log</Link></li>}
          </ul>
          <div>
            <Logout/>
          </div>   
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
