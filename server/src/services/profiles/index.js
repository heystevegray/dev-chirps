import { ApolloError, ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import initMongoose from "../../config/mongoose";
import permissions from "./permissions";
import Profile from "../../models/Profile";
import ProfilesDataSource from "./datasources/ProfilesDataSource";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
	const port = process.env.PROFILES_SERVICE_PORT;

	const schema = applyMiddleware(
		buildFederatedSchema([{ typeDefs, resolvers }]),
		permissions
	);

	const server = new ApolloServer({
		schema,
		context: ({ req }) => {
			const user = req.headers.user ? JSON.parse(req.headers.user) : null;
			return { user };
		},
		dataSources: {
			profilesAPI: new ProfilesDataSource({ Profile }),
		},
	});

	initMongoose();

	const { url } = await server.listen({ port });
	console.log(`Profiles service is ready at ${url} 👽`);
})();
