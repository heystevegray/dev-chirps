import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new createHttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT }),
});

export default client;
