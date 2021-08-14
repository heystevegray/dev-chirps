import app from "./config/app";
import initGateway from "./config/apollo/apollo";
import waitOn from "wait-on";
import { ApolloError } from "apollo-server-express";

const SERVICES = [
	{
		port: `tcp:${process.env.ACCOUNTS_SERVICE_PORT}`,
		name: "accounts",
		url: process.env.ACCOUNTS_SERVICE_URL,
	},
	{
		port: `tcp:${process.env.PROFILES_SERVICE_PORT}`,
		name: "profiles",
		url: process.env.PROFILES_SERVICE_URL,
	},
];

const options = {
	resources: SERVICES.map((resource) => resource.port),
};

export const dynamicServiceList = SERVICES.map(({ name, url }) => {
	return {
		name,
		url,
	};
});

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
			`🚀 Server ready at http://localhost:${port}${server.graphqlPath} 🚀`
		);
	});
})().catch((error) => {
	throw new ApolloError(`Error starting the main server 😬 \n${error}`);
});
