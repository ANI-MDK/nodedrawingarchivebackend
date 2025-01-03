import "./App.css";
import { useState } from 'react';
import axios from 'axios';
import {  useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleReCaptchaProvider, GoogleReCaptcha }  from 'react-google-recaptcha-v3';

//import { useAuth } from "./AuthContext";

const Login=(e)=>{
    //const { login, token } = useAuth();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const initialValues = {email:"", password:""};
    const [formValues, setFormValues] = useState(initialValues);
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>{
        const{ name, value} = e.target;
        setFormValues({...formValues, [name]:value});
        //console.log(formValues);
    }

    const handleToken = (getToken) =>{
        setToken(getToken);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        navigate("/dashboard");
        //console.log(process.env);
        //console.log(baseUrl);


        if(!token) {
            //console.log("Error please check");
            return;
        }
        await axios.post(`${baseUrl}/login/auth`,{username:formValues.email, password:formValues.password, token:token},{withCredentials:true,})
        .then(response => 
            {
                //console.log(response);
                if (response.data.status==="success")
                {
                    localStorage.setItem("token", JSON.stringify(response.headers.authorization));
                    localStorage.setItem("UserData",JSON.stringify(response.data.data));
                    //console.log(response.data.data);
                    navigate("/dashboard");
                }
                else{
                    toast(response.data.message,{position:"top-center"})
                    setTimeout(()=>{
                        window.location.reload();
                    },5000);
                   
                    //console.log(response.data.message);
                }
            }
        )
        .catch(error => 
            {
            //console.log('Error fetching data:', error);
            toast(error,{position:"top-center"})
            }
        );
        setFormValues(initialValues);
    }


    return(
        <GoogleReCaptchaProvider reCaptchaKey="6Lc5vX8qAAAAAMvnMu2DjiL4iSfSWTVG-IisbGLO">
            <GoogleReCaptcha className="google-recaptcha-custom-class" onVerify={handleToken}/>
            <div className="min-h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center" style={{backgroundImage: `url(${require("../src/assets/drawing.png")})`,}}>
                <h2 className="text-4xl text-gray-900 font-bold text-center mb-4 underline text-opacity-70 font-mono">Drawing Archive App</h2>
                <div className="bg-gray-500 bg-opacity-50 p-8 rounded-lg shadow-lg max-w-md w-full">
                    {/* <h2 className="text-4xl text-gray-50 font-bold text-center mb-4 underline text-opacity-70 font-mono">Drawing Archive App</h2> */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">EMAIL ID</label>
                            <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your email" name="email" id="email" value={formValues.email} onChange={handleChange} required/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">PASSWORD</label>
                            <input type={showPassword ? 'text' : 'password'} className="mt-1 inline-block w-5/6 px-3 py-2 border border-gray-300 bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your password" name="password" id="password" value={formValues.password} onChange={handleChange} required/><button type="button" onClick={togglePasswordVisibility} className="ml-1 px-3 py-2 border border-gray-300 bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{showPassword ? 'Hide' : 'Show'}</button>
                        </div>
                        <div>
                            <input type="submit" value="Login" className="w-full mt-6 mb-2 px-4 py-2 bg-red-600 text-red-100 text-lg font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2 cursor-pointer"/>
                        </div>
                    </form>
                    <p className="text-sm text-center text-red-50">&copy;Esteem Infrastructure Pvt Ltd, 2024. All rights reserved.</p>
                    <ToastContainer />
                </div>
            </div>
        </GoogleReCaptchaProvider>
    )
}
export default Login;

