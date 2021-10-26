import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import { wait, dynamicServiceList } from "../../index";
import { readNestedFileStreams } from "../../lib/handleUploads";
import { RedisCache } from "apollo-server-cache-redis";
import depthLimit from "graphql-depth-limit";

// https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference/#willresolvefield

const myPlugin = {
	// Fires whenever a GraphQL request is received from a client.
	async requestDidStart(requestContext) {
		// console.log(
		// 	"Request started! Query:\n" + requestContext.request.query
		// );

		return {
			// Fires whenever Apollo Server will parse a GraphQL
			// request to create its associated document AST.
			async parsingDidStart(requestContext) {
				console.log("Parsing started!");

				console.log(`Query:\n\n`);
				console.log(requestContext.request.query);

				console.log(`Variables:\n\n`);
				console.log(requestContext.request, "\n\n");
			},

			// Fires whenever Apollo Server will validate a
			// request's document AST against your GraphQL schema.
			async validationDidStart(requestContext) {
				// console.log("Validation started!");
			},

			async willSendResponse(requestContext) {
				console.log("About to send the response!");
				if (requestContext.response.errors) {
					console.error("response errors:");
					console.log(requestContext.response.errors);
				}

				console.log("response data:");
				console.log(requestContext.response.data);
			},

			// async responseForOperation(requestContext) {
			// 	console.log();

			// }
		};
	},
};

export default async function () {
	await wait();

	const gateway = new ApolloGateway({
		serviceList: dynamicServiceList,
		buildService(service) {
			const { name, url } = service;
			console.log(`⚙️\tBuilding the ${name} service ${url}`);
			return new RemoteGraphQLDataSource({
				url,
				async willSendRequest({ request, context }) {
					await readNestedFileStreams(request.variables);
					request.http.headers.set(
						"user",
						context.user ? JSON.stringify(context.user) : null
					);
				},
			});
		},
	});

	console.log("Created the Apollo Gateway");

	return new ApolloServer({
		gateway,
		subscriptions: false,
		context: ({ req }) => {
			const user = req.user || null;
			return { user };
		},
		persistedQueries: {
			cache: new RedisCache({
				...(process.env.NODE_ENV === "production" && {
					password: process.env.REDIS_PASSWORD,
				}),
				host: process.env.REDIS_HOST_ADDRESS,
				port: process.env.REDIS_PORT,
				ttl: 600,
			}),
		},
		validationRules: [depthLimit(10)],
	});
}
