import { createContext,useEffect,useState } from "react";
import Axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

    const [currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    // original login
    // const login = async(inputs) => {
    //     const res = await Axios.post("http://localhost:2030/api/login", inputs, {withCredentials:true});
    //     setCurrentUser(res.data);
    // };

    // new login (using storage)
    const login = async (inputs) => {
        try {
          const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, inputs);
          const token = response.data.token;
      
          // Store the token in local storage
          localStorage.setItem("access_token", token);
      
          setCurrentUser(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      
    // original logout
    // const logout = async(inputs) => {
    //     await Axios.post("http://localhost:2030/api/logout", {withCredentials:true});
    //     setCurrentUser(null);
    // };

    // new logout (using local storage)
    const logout = async () => {
        try {
          await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`);
          localStorage.removeItem("access_token");
          setCurrentUser(null);
        } catch (error) {
          console.log(error);
        }
    };
      
      

    useEffect(() => {
        localStorage.setItem("user",JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>{children}</AuthContext.Provider>
    )
};