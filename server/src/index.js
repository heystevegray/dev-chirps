import app from "./config/app";
import initGateway from "./config/apollo/apollo";
import waitOn from "wait-on";
import { ApolloError } from "apollo-server-express";
import {
	graphqlUploadExpress, // A Koa implementation is also exported.
} from "graphql-upload";

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
	{
		port: `tcp:${process.env.CONTENT_SERVICE_PORT}`,
		name: "content",
		url: process.env.CONTENT_SERVICE_URL,
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

	/*
	 * This middleware should be added before calling `applyMiddleware`.

	 * This one line of code is SUPER IMPORTANT FOR IMAGE UPLOADS!!!!!!!!!!!
	 * This resolved that fucking horrible "POST body missing, invalid Content-Type, or JSON object has no keys." error. 
	 * Found this in the apollo docs here: https://www.apollographql.com/docs/apollo-server/data/file-uploads/#integrating-with-express
	 */
	app.use(graphqlUploadExpress());

	await server.start();
	server.applyMiddleware({ app, cors: false });
	app.listen({ port }, async () => {
		console.log(
			`🚀 Server ready at http://localhost:${port}${server.graphqlPath} 🚀`
		);
	});
})().catch((error) => {
	throw new ApolloError(`Error starting the main server 😬 \n\n\n\n${error}`);
});
