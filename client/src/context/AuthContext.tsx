import { createContext, useContext, ReactElement } from "react";

const AuthContext = createContext({});
const userAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactElement }) => {
	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export { AuthProvider, userAuth };
export default AuthContext;
