import {  useState,useEffect } from 'react';
import { LoginUser } from '../services/auth';
import AuthProvider from '../context/UserContext';

export const AuthContainer = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [authenticated, setAuthenticated] = useState(false)
    useEffect(() => {
      const storedUser = localStorage.getItem('userDetails');
      if (storedUser) {
        setAuthenticated(true); 
        setUser(JSON.parse(storedUser));
      }
    },[]);
    const login = async (loginDetails) => {
      try {
        
        const LoggedUser = await LoginUser(loginDetails)
        if(LoggedUser.status===200 || LoggedUser.status===201){
          setUser({
            _id: LoggedUser.data.user._id,
            username: LoggedUser.data.user.username,
            email:LoggedUser.data.user.email

          });
          setAuthenticated(true); 
        }
        return LoggedUser
      } catch (error) {
        setAuthenticated(false);
        throw error
      }
    };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token')
    localStorage.removeItem('userDetails')
    localStorage.removeItem('phoneNumber')
    setAuthenticated(false);
  };

  const value = {
    user,
    login,
    logout,
    authenticated
  };

  return <AuthProvider value={value}>{children}</AuthProvider>;
};
