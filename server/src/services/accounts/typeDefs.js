import { gql } from "apollo-server";

const typeDefs = gql`
	input CreateAccountInput {
		email: String!
		password: String!
	}

	input AccountWhereUniqueInput {
		id: ID!
	}

	input UpdateAccountInput {
		email: String
		newPassword: String
		password: String
	}

	type Account @key(fields: "id") {
		id: ID!
		createdAt: String!
		email: String
		isBlocked: Boolean
		isModerator: Boolean
	}

	extend type Query {
		viewer: Account
		account(id: ID!): Account!
		accounts: [Account]
	}

	extend type Mutation {
		createAccount(data: CreateAccountInput!): Account!
		deleteAccount(where: AccountWhereUniqueInput!): Boolean!
		changeAccountModeratorRole(where: AccountWhereUniqueInput!): Account!
		changeAccountBlockedStatus(where: AccountWhereUniqueInput!): Account!
		updateAccount(
			data: UpdateAccountInput!
			where: AccountWhereUniqueInput!
		): Account!
	}
`;

export default typeDefs;
