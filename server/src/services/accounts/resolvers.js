import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
	DateTime: DateTimeResolver,
	Account: {
		__resolveReference(reference, { dataSources }, info) {
			return dataSources.accountsAPI.getAccountById(reference.id);
		},
		id(account, args, context, info) {
			return account.user_id;
		},
		createdAt(account, args, { dataSources }, info) {
			if (account.created_at) {
				return account.created_at;
			}

			/*
			 * TODO: Why do I have to do this????
			 * Why is account.created_at null when fetching the profile query?
			 * You are extending the Account type that's defined in the Accounts federated schema
			 */
			return dataSources.accountsAPI
				.getAccountById(account.id)
				.then((result) => result.created_at);
		},
		isModerator(account, args, { dataSources }, info) {
			if (account.app_metadata) {
				return (
					account.app_metadata &&
					account.app_metadata.roles &&
					account.app_metadata.roles.includes("moderator")
				);
			}

			/*
			 * TODO: Why do I have to do this????
			 */
			return dataSources.accountsAPI
				.getAccountById(account.id)
				.then((result) => {
					return (
						result.app_metadata &&
						result.app_metadata.roles &&
						result.app_metadata.roles.includes("moderator")
					);
				});
		},
		isBlocked(account, args, { dataSources }, info) {
			// return account.blocked;

			/*
			 * TODO: Why do I have to do this????
			 */
			return dataSources.accountsAPI
				.getAccountById(account.id)
				.then((result) => result.blocked);
		},
	},
	Query: {
		account(parent, { id }, { dataSources }, info) {
			return dataSources.accountsAPI.getAccountById(id);
		},
		accounts(parent, { id }, { dataSources }, info) {
			return dataSources.accountsAPI.getAccounts();
		},
		viewer(parent, args, { user, dataSources }, info) {
			if (user && user.sub) {
				return dataSources.accountsAPI.getAccountById(user.sub);
			}
			return null;
		},
	},
	Mutation: {
		changeAccountModeratorRole(
			parent,
			{ where: { id } },
			{ dataSources },
			info
		) {
			return dataSources.accountsAPI.changeAccountModeratorRole(id);
		},
		changeAccountBlockedStatus(
			parent,
			{ where: { id } },
			{ dataSources },
			info
		) {
			return dataSources.accountsAPI.changeAccountBlockedStatus(id);
		},
		createAccount(
			parent,
			{ data: { email, password } },
			{ dataSources },
			info
		) {
			return dataSources.accountsAPI.createAccount(email, password);
		},
		deleteAccount(parent, { where: { id } }, { dataSources }, info) {
			return dataSources.accountsAPI.deleteAccount(id);
		},
		updateAccount(parent, { data, where: { id } }, { dataSources }, info) {
			return dataSources.accountsAPI.updateAccount(id, data);
		},
	},
};

export default resolvers;
