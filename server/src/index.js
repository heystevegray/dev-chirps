import app from "./config/app";
import initGateway from "./config/apollo";
import waitOn from "wait-on";
import { ApolloError } from "apollo-server-express";

const options = {
	resources: [
		// `tcp:${process.env.ACCOUNTS_SERVICE_PORT}`,
		`tcp:${process.env.PROFILES_SERVICE_PORT}`,
	],
};

export const dynamicServiceList = [
	// { name: "accounts", url: process.env.ACCOUNTS_SERVICE_URL },
	{ name: "profiles", url: process.env.PROFILES_SERVICE_URL },
];

export const wait = async () => {
	await waitOn(options)
		.then(async () => {
			console.log(`Finished waiting on ${options.resources.join(", ")}`);
		})
		.catch((error) => {
			console.log("Error waiting for services:", error);
		});
};

(async () => {
	const port = process.env.PORT;

	const server = await initGateway();
	await server.start();
	server.applyMiddleware({ app });
	app.listen({ port }, async () => {
		console.log(
			`Server ready at http://localhost:${port}${server.graphqlPath} 🚀`
		);
	});
})().catch((error) => {
	throw new ApolloError(`Error starting the main server 😬 \n${error}`);
});
