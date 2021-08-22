import createAuth0Client, {
	Auth0Client,
	Auth0ClientOptions,
	RedirectLoginOptions,
} from "@auth0/auth0-spa-js";
import { createContext, useContext, useEffect, useState } from "react";
import history from "../routes/history";

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

const initOptions: Auth0ClientOptions = {
	audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
	client_id: process.env.REACT_APP_AUTH0_CLIENT_ID || "",
	domain: process.env.REACT_APP_AUTH0_DOMAIN || "",
	redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

const AuthProvider = ({ children }: { children: any }) => {
	const [auth0Client, setAuth0Client] = useState<Auth0Client>();
	const [checkingSession, setCheckingSession] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const initializeAuth0 = async () => {
			try {
				const client = await createAuth0Client(initOptions);
				setAuth0Client(client);

				if (window.location.search.includes("code=")) {
					await client.handleRedirectCallback();
					history.replace({ pathname: "/home", search: "" });
				}

				const authenticated = await client.isAuthenticated();
				setIsAuthenticated(authenticated);
			} catch {
				history.location.pathname !== "/" && history.replace("/");
			} finally {
				setCheckingSession(false);
			}
		};

		initializeAuth0();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				checkingSession,
				isAuthenticated,
				login: (options: RedirectLoginOptions) =>
					auth0Client?.loginWithRedirect(options),
				logout: (options: RedirectLoginOptions) =>
					auth0Client?.logout({
						...options,
						returnTo: process.env.AUTH0_LOGOUT_URL,
					}),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, useAuth };
export default AuthContext;
