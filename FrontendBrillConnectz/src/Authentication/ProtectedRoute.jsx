import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem('userDetails');
  const token = localStorage.getItem('token');
  if (!storedUser && !token) {
    return <Navigate to="/login" />;
  }
  return children;
};


export default ProtectedRoute;
