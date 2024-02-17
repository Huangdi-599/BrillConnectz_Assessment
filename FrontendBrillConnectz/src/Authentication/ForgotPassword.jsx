import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { forgotPassword } from '../services/auth';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true); 
    try {
      const response = await forgotPassword(values)
      if(response?.status===200 || response?.status===201){
        toast.success(response.data?.msg);
      }
      setLoading(false)
      resetForm();
    } catch (err) {
      setLoading(false)
      setSubmitting(false);
      console.error('Error:', err)
      toast.error(err?.response.data?.msg ||'Operation Failed')
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
