import API from './Api';


export const registerUser = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    return response
  } catch (error) {
    console.error(error)
    throw error;
  }
};
export const LoginUser = async (userData) => {
  try {
    const response = await API.post('/login', userData);
    return response
  } catch (error) {
    console.error(error)
    throw error;
  }
};
export const forgotPassword = async (userData) => {
  try {
    const response = await API.post('/forgotpass', userData);
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
};

export const resetPassword = async (resetToken,userData) => {
  try {
    const response = await API.put(`/resetPassword/${resetToken}`, userData);
    return response
  } catch (error) {
    console.error(error)
    throw error

  }
};

export const confirmMail = async (userData) => {
  try {
    const response = await API.get(`/confirm/${userData}`);
    return response
  } catch (error) {
    console.error(error)
    throw error

  }
};

export const verifyOtp = async (userData) => {
  try {
    const response = await API.post(`/otp/verify`,userData);
    return response
  } catch (error) {
    console.error(error)
    throw error

  }
};

export const sendOtp = async (userData) => {
  try {
    const response = await API.post(`/otp/send`,userData);
    return response
  } catch (error) {
    console.error(error)
    throw error

  }
};
