import API from './Api';


export const updateEmail = async (user_id,userData) => {
    try {
      const response = await API.put(`/update/email/${user_id}`, userData);
      return response
    } catch (error) {
      console.error(error)
      throw error;
    }
  };

  export const updatePassword = async (user_id,userData) => {
    try {
      const response = await API.put(`/update/password/${user_id}`, userData);
      return response
    } catch (error) {
      console.error(error)
      throw error;
    }
  };
  export const updateUsername = async (user_id,userData) => {
    try {
      const response = await API.put(`/update/username/${user_id}`, userData);
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  };
  export const getUser = async (user_id,) => {
    try {
      const response = await API.get(`/user/${user_id}`);
      return response
    } catch (error) {
      console.error(error)
      throw error;
    }
  };