import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = Yup.object().shape({
  login: Yup.string().required('Required'), // This can be an email or phone number, so we keep validation simple
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await login(values);
      if (response?.status === 200 || response?.status === 201) {
        if (!response?.data.user.isPhoneNumberVerified) {
          toast.error('Your Phone Number has not been Verified')
          navigate('/verifyotp')
        }
        if (!response.data.user.isEmailVerified) {
          toast.error('Confirm your Email');
          setLoading(false)
          return
        }
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('userDetails', JSON.stringify({
          _id: response.data.user._id,
          username: response.data.user.username,
          email:response.data.user.email
        }))
        toast.success(response?.data?.msg)
      }
      setLoading(false)
      setTimeout(()=>{
        navigate('/profile')
      },[1000])
    } catch (error) {
      setLoading(false)
      setSubmitting(false);
      if(error?.response.data?.code==418){
        toast.error(error?.response.data?.msg)
        return
      }
      if(error?.response.data?.code==419){
        toast.error(error?.response.data?.msg)
        setTimeout(()=>{
          navigate('/verifyotp')
        },[1000])
      }
      console.error("Error:", error)
      toast.error(error?.response.data?.msg || "Operation Failed")
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 shadow px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field className="w-full p-2 border rounded" type="text" name="login" placeholder="Email or Phone Number" />
              <ErrorMessage name="login" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <Field className="w-full p-2 border rounded" type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            {loading && (
              <div className="flex justify-center items-center">
                <div className="loader"></div>
              </div>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
              {loading ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="forgot-password-link mt-2">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <div className="mt-4">
        {`Don't`} have an account? <Link to="/signup">Register</Link>
      </div>
        <ToastContainer />
    </div>
  );
};

export default Login;
