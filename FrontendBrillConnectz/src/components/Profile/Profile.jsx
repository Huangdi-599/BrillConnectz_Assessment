import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getUser } from '../../services/user';
import defaultprofile from '../../assets/avatar_default.png'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUser(user?._id);
        if (response?.status === 200 || response?.status === 201){
          setProfile(prevState => ({
            ...prevState,
            ...response?.data?.user
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        toast.error(error?.response?.data?.msg || 'An error occurred');
      }
    };
  
    if (user && user._id) {
      fetchUserProfile();
    }
  }, [user]);
  

  const avatarSrc = profile?.avatar || defaultprofile;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-[50px] lg:mt-[100px]">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Cover */}
        <div className="bg-gray-200 h-32 w-full object-cover" style={{ backgroundImage: `url(${profile.cover || 'DEFAULT_COVER_LINK'})` }}></div>

        {/* Avatar & Info */}
        <div className="flex justify-center items-center p-6">
          <div className="flex flex-col items-center space-y-[10px]">
            <img className="h-24 w-24 rounded-full border-4 border-white -mt-12 object-cover" src={avatarSrc} alt="Avatar" />
            <h1 className="text-xl font-semibold mt-4">{profile?.lastname} {profile?.firstname}</h1>
            <h1 className="text-xl font-semibold mt-4">{profile?.username}</h1>
            <p className="text-gray-600">{profile?.phoneNumber}</p>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
        </div>

        {/* Interests */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap justify-center">
            {profile?.interests?.map((interest, index) => (
              <span key={index} className="bg-gray-200 rounded-full px-4 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{interest}</span>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
