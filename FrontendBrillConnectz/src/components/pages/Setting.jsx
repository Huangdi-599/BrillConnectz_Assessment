import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { updateEmail, updateUsername , updatePassword} from '../../services/user';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';

const Settings = () => {
    const { user, logout, } = useAuth();
    const [emailloading, setemailLoading] = useState(false);
    const [passloading, setpassLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const emailFormik = useFormik({
        initialValues: {
            email: user?.email || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
        }),
        onSubmit: async (values) => {
            setemailLoading(true);
            try {
                const response = await updateEmail(user?._id,values);
                if (response?.status === 200 || response?.status == 201) {
                    toast.success(response?.data?.msg)
                    setemailLoading(false)
                    setTimeout(()=>{
                        logout();
                        navigate("/login")
                    },[1000])
                    
                }
            } catch (error) {
                setemailLoading(false)
                toast.error(error?.response.data?.msg ||'Operation Failed')
            }

        },
    });

    const usernameFormik = useFormik({
        initialValues: {
            username: user?.username || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await updateUsername(user?._id,values);
                if (response?.status === 200 || response?.status == 201) {
                    toast.success(response?.data?.msg)
                }
                setLoading(false)

            } catch (error) {
                console.error("Error:", error)
                toast.error(error?.response.data?.msg)
                setLoading(false)
            }
        },
    });


    const passwordFormik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Required'),
            newPassword: Yup.string().min(6, 'Must be 6 characters or more').required('Required'),
        }),
        onSubmit: async (values) => {
            setpassLoading(true);
            try {
                const response = await updatePassword(user?._id,values);
                if (response?.status === 200 || response?.status == 201) {
                    toast.success(response?.data?.msg)
                    setpassLoading(false)
                    setTimeout(()=>{
                        logout();
                        navigate("/login")
                    },[1000])
                }
            } catch (error) {
                console.error("Error:", error)
                toast.error(error?.response?.data?.msg)
                setpassLoading(false)
            }
        },
    });

    const logouts = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="w-full max-w-xs">
                {/* Update Username */}
                <form onSubmit={usernameFormik.handleSubmit} className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        {...usernameFormik.getFieldProps('username')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {usernameFormik.touched.username && usernameFormik.errors.username ? (
                        <p className="text-red-500 text-xs italic">{usernameFormik.errors.username}</p>
                    ) : null}
                    {loading && (
                      <div className="flex justify-center items-center">
                        <div className="loader"></div>
                      </div>
                    )}
                    <button disabled={loading} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full mt-4">
                        {loading? "Updating ...." :"Update Username"}
                    </button>
                </form>

                {/* Update Email */}
                <form onSubmit={emailFormik.handleSubmit} className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...emailFormik.getFieldProps('email')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {emailFormik.touched.email && emailFormik.errors.email ? (
                        <p className="text-red-500 text-xs italic">{emailFormik.errors.email}</p>
                    ) : null}
                    {emailloading && (
                      <div className="flex justify-center items-center">
                        <div className="loader"></div>
                      </div>
                    )}
                    <button disabled={emailloading} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full mt-4">
                        {emailloading? 'Updating....': 'Update Email'}
                    </button>
                </form>

                {/* Update Password */}
                <form onSubmit={passwordFormik.handleSubmit} className="mb-4">
                    <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        Old Password
                    </label>
                    <input
                        id="oldPassword"
                        type="password"
                        {...passwordFormik.getFieldProps('oldPassword')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword ? (
                        <p className="text-red-500 text-xs italic">{passwordFormik.errors.oldPassword}</p>
                    ) : null}

                    <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        {...passwordFormik.getFieldProps('newPassword')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                        <p className="text-red-500 text-xs italic">{passwordFormik.errors.newPassword}</p>
                    ) : null}
                    {passloading && (
                      <div className="flex justify-center items-center">
                        <div className="loader"></div>
                      </div>
                    )}
                    <button disabled={passloading} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full">
                        {passloading? 'Updating....': 'Update Password'}
                    </button>
                </form>

                {/* Logout Button */}
                <button onClick={logouts} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded block w-full mt-4">
                    Logout
                </button>
            </div>
                <ToastContainer />
        </div>
    );
};

export default Settings;
