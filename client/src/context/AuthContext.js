import createAuth0Client from "@auth0/auth0-spa-js";
import { createContext, useContext, useEffect, useState } from "react";
import { createApolloClient } from "../graphql/apollo";
import { GET_VIEWER } from "../graphql/queryies";
import history from "../routes/history";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const initOptions = {
	audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
	client_id: process.env.REACT_APP_AUTH0_CLIENT_ID || "",
	domain: process.env.REACT_APP_AUTH0_DOMAIN || "",
	redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

const AuthProvider = ({ children }) => {
	const [auth0Client, setAuth0Client] = useState();
	const [checkingSession, setCheckingSession] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [viewerQuery, setViewerQuery] = useState(null);

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

				if (history.location.pathname === "/login" && authenticated) {
					history.replace("/home");
				} else if (history.location.pathname === "/login") {
					history.replace("/");
				} else if (authenticated) {
					const apolloClient = createApolloClient((options) =>
						client.getTokenSilently(options)
					);
					const viewer = await apolloClient.query({
						query: GET_VIEWER,
					});
					setViewerQuery(viewer);
				}
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
				getToken: (options) => auth0Client.getTokenSilently(options),
				isAuthenticated,
				login: (options) => auth0Client?.loginWithRedirect(options),
				logout: (options) =>
					auth0Client?.logout({
						...options,
						returnTo: process.env.AUTH0_LOGOUT_URL,
					}),
				updateViewer: (viewer) =>
					setViewerQuery({ ...viewerQuery, data: { viewer } }),
				viewerQuery,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, useAuth };
export default AuthContext;
