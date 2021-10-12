import {
	ApolloClient,
	ApolloLink,
	ApolloProvider,
	InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "../context/AuthContext";
import typePolicies from "./typePolicies";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";

const cache = new InMemoryCache({ typePolicies });

const createApolloClient = (getToken) => {
	const uploadLink = createUploadLink({
		uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
	});

	const authLink = setContext(async (request, { headers }) => {
		const accessToken = await getToken();
		return {
			headers: { ...headers, Authorization: `Bearer ${accessToken}` },
		};
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach(
				({ extensions: { serviceName }, message, path }) =>
					console.error(
						`[GraphQL error]: Messages: ${message}, Service: ${serviceName}, Path: ${path[0]}`
					)
			);
		}
		if (networkError) {
			console.error(`[Network error]: ${networkError}`);
		}
	});

	return new ApolloClient({
		cache,
		/*  
		 We could add even more links to this chain if we wanted to, but it’s important
		 to note that the terminating uploadLink must always be the last item passed into
		 the array because it sends our network request.

		 Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
		*/
		link: ApolloLink.from([errorLink, authLink, uploadLink]),
	});
};

const ApolloProviderWithAuth = ({ children }) => {
	const { getToken } = useAuth();
	const client = createApolloClient(getToken);

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { createApolloClient };
export default ApolloProviderWithAuth;
