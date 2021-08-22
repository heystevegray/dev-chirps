import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "../context/AuthContext";

const cache = new InMemoryCache();

const createApolloClient = (getToken) => {
	const httpLink = createHttpLink({
		uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
	});
	const authLink = setContext(async (request, { headers }) => {
		const accessToken = await getToken();
		return {
			headers: { ...headers, Authorization: `Bearer ${accessToken}` },
		};
	});

	return new ApolloClient({
		cache,
		link: authLink.concat(httpLink),
	});
};

const ApolloProviderWithAuth = ({ children }) => {
	const { getToken } = useAuth();
	const client = createApolloClient(getToken);

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { createApolloClient };
export default ApolloProviderWithAuth;
