import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Adjust the import path as necessary

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clear user authentication state
    navigate('/'); // Redirect to home page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
