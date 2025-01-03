import { useNavigate } from "react-router-dom";

//import { useAuth } from "../AuthContext";

const isAuthenticated = () => {
    return localStorage.getItem('token'); // or sessionStorage, or a global state
  };

const Logout = () => {
    //const { logout, token, userData } = useAuth();
    let data = isAuthenticated() ? JSON.parse(localStorage.getItem("UserData")) : null;
    //console.log(data);
    const navigate = useNavigate();

    const handelLogout=()=>{
        navigate("/");
        localStorage.clear();
    }
    
    return (
            <>
                <span className="mr-2 font-style: italic font-weight: 700 text-xl text-green-500 font-mono font-extrabold tracking-wider">Hi, {data!==null ? data.user_name : ""}</span>
                <button className="bg-red-600 text-red-50 text-md px-3 py-1 rounded-md hover:bg-red-700 mx-4" onClick={handelLogout}>Logout</button>
            </>
        );
  };

  export default Logout;