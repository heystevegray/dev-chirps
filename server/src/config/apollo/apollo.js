import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import { wait, dynamicServiceList } from "../../index";

export default async function () {
	await wait();

	const gateway = new ApolloGateway({
		serviceList: dynamicServiceList,
		buildService(service) {
			const { name, url } = service;
			console.log(`⚙️\tBuilding the ${name} service ${url}`);
			return new RemoteGraphQLDataSource({
				url,
				willSendRequest({ request, context }) {
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
	});
}
