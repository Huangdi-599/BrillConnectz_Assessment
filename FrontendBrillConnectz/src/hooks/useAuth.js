import { useContext } from "react";
import { AuthContext } from "../context/UserContext";

const useAuth = ()=>useContext(AuthContext);

export default useAuth;
