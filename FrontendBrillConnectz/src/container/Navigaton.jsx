import { NavLink, Outlet } from 'react-router-dom';
import { IoHomeOutline, IoPeopleOutline, IoSettingsOutline, IoCompassOutline, IoLogInOutline, IoPersonAddOutline } from 'react-icons/io5';
import useAuth from '../hooks/useAuth';

const Navigation = () => {
  const { user } = useAuth();
  console.log('user',user)
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-800 text-white p-4 fixed top-0 inset-x-0 z-10 hidden lg:flex justify-end space-x-4">
        {/* Desktop Top Navigation */}
        <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Discover</NavLink>
        <NavLink to="/buddies" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Buddies</NavLink>
        {!user ? (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Signup</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Profile</NavLink>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>Settings</NavLink>
          </>
        )}
      </nav>
      <div className="flex-grow pt-16 lg:pt-0">
        <Outlet />
      </div>
      <nav className=" bg-gray-800 text-white p-4 fixed bottom-0 inset-x-0 z-10 flex lg:hidden justify-around">
        {/* Mobile Bottom Navigation */}
        <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
          <IoCompassOutline size={24} />
        </NavLink>
        <NavLink to="/buddies" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
          <IoPeopleOutline size={24} />
        </NavLink>
        {!user ? (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
              <IoLogInOutline size={24} />
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
              <IoPersonAddOutline size={24} />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
              <IoHomeOutline size={24} />
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white')}>
              <IoSettingsOutline size={24} />
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
