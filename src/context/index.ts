import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const useUserContext = () => useContext(AuthContext);

export default useUserContext;
