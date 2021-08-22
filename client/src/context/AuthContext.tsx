import { createContext, useContext } from "react";

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: any }) => {
	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
export default AuthContext;
