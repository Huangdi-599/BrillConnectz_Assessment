import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { confirmMail } from '../services/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ConfirmEmail = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      setLoading(true);
      try {
        const response = await confirmMail(userId)
        if(response.status===200 || response.status===201){
          toast.success(response.data.msg);
          setStatusMessage(response.data.msg);
        }
        if(!response.data.user.isPhoneNumberVerified){
          setTimeout(()=>{
            navigate('/verifyotp');
          },[1000])
        }
        setTimeout(()=>{
          navigate('/login');
        },[1000])
        setLoading(false);
        
      } catch (error) {
        setStatusMessage(error.response?.data?.msg || 'An error occurred during email confirmation.');
        setLoading(false);
      }
    };
    confirmEmail();
  }, [userId]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
          {loading && (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              )}
        <h2 className="text-lg font-semibold">{statusMessage}</h2>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfirmEmail;
