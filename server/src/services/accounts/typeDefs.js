import { gql } from "apollo-server";

const typeDefs = gql`
	input CreateAccountInput {
		email: String!
		password: String!
	}

	type Account @key(fields: "id") {
		id: ID!
		createdAt: String!
		email: String
	}

	extend type Query {
		viewer: Account
		account(id: ID!): Account!
		accounts: [Account]
	}

	extend type Mutation {
		createAccount(data: CreateAccountInput!): Account!
	}
`;

export default typeDefs;
