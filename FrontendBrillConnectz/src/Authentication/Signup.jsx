import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../services/auth';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate, Link } from "react-router-dom";



const signupSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phoneNumber: Yup.string().required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  interests: Yup.array().of(Yup.string()).required('Required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true); 
    try {
      const newUser = await registerUser(values)
      if(newUser.status===200 || newUser.status===201){
        toast.success(newUser.data.msg)
        localStorage.setItem('phoneNumber', newUser.data.phoneNumber);
      }
      setTimeout(()=>{
        navigate('/verifyotp')
      },[1000])
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error('Signup failed. Please try again.');
      setLoading(false)
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <h1 className="mb-4 text-lg font-semibold">Signup</h1>
        <Formik
          initialValues={{ username: '', firstname: '', lastname: '', email: '', phoneNumber: '', password: '', interests: [] }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="username" placeholder="Username" />
                <ErrorMessage name="username" component="div" className="text-red-500 text-xs italic" />
              </div>

              <div className="mb-4">
                <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="firstname" placeholder="First Name" />
                <ErrorMessage name="firstname" component="div" className="text-red-500 text-xs italic" />
              </div>

              <div className="mb-4">
                <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="lastname" placeholder="Last Name"/>
                <ErrorMessage name="lastname" component="div" className="text-red-500 text-xs italic" />
              </div>
          <div className="mb-4">
          <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic" />
        </div>

        <div className="mb-4">
          <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="phoneNumber" placeholder="Phone Number" />
          <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs italic" />
        </div>

        <div className="mb-4">
          <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" className="text-red-500 text-xs italic" />
        </div>

        <div className="mb-4">
          <Field as="select" name="interests" multiple className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="skiing">Skiing</option>
            <option value="baseball">Baseball</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
            <option value="cricket">Cricket</option>
            <option value="rugby">Rugby</option>
            <option value="golf">Golf</option>
            <option value="cycling">Cycling</option>
          </Field>
          <ErrorMessage name="interests" component="div" className="text-red-500 text-xs italic" />
          </div>
          {loading && (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
          )}
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {loading ? 'Submitting...' : 'Submit'}            
            </button>
          </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
  </div>
    <ToastContainer />
</div>
  )
}
export default Signup;