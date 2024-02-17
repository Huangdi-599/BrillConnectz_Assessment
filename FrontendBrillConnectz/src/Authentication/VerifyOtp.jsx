import { useState, useEffect } from 'react';
import { verifyOtp, sendOtp } from '../services/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const verify = async (otp)=>{
    try {
      const phoneNumber=localStorage.getItem('phoneNumber');
      const response = await verifyOtp({
        phoneNumber:phoneNumber,
        otp:otp
      })
      if (response?.status === 200 || response?.status === 201){
        toast.success(response?.data?.msg)
      }
      setTimeout(()=>{
        navigate('/login')
      },[1000])
    } catch (error) {
      console.error("Error:", error)
      toast.error(error?.response.data?.msg || "Operation Failed")
    }
  }
  
  const send = async ()=>{
    try {
      const phoneNumber=localStorage.getItem('phoneNumber');
      const response = await sendOtp({
        phoneNumber:phoneNumber,
      })
      if (response?.status === 200 || response?.status === 201){
        toast.success(response?.data?.msg)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error?.response.data?.msg || "Operation Failed")
    }
  }
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setTimeLeft(60); // Reset timer for the next use
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Process OTP here, e.g., verify it
    verify(otp)
    console.log(otp);
    // Optionally reset OTP input after submit
    setOtp('');
  };

  const handleResendOtp = () => {
    setIsTimerActive(true);
    // Trigger OTP resend functionality here
    send()
    console.log('OTP resend triggered');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center">Verify Your Phone Number</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Input OTP</label>
            <input
              type="text"
              id="otp"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              maxLength="6"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!otp}
          >
            Submit OTP
          </button>
        </form>
        <button
          onClick={handleResendOtp}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-transparent hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isTimerActive}
        >
          Resend OTP
        </button>
        {isTimerActive && (
          <p className="mt-2 text-center text-sm text-gray-600">Please wait for {timeLeft} seconds to resend OTP</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyOtp;
