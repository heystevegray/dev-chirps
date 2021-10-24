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
					if (result) {
						return (
							result.app_metadata &&
							result.app_metadata.roles &&
							result.app_metadata.roles.includes("moderator")
						);
					}

					return false;
				});
		},
		isBlocked(account, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * Why does the value of account.id change for the changeAccountBlockedStatus mutation?
			 *
			 * Sometimes account looks like this:
			 * { account: { __typename: 'Account', id: 'auth0|123456789' }}
			 *
			 * Other times account looks like this (from Auth0):
			 *	{
			 *		user_id: 'auth0|123456789',
			 *		blocked: true,
			 *		app_metadata: {
			 *		  groups: [],
			 *		  roles: [],
			 *		  permissions: []
			 *		}
			 *		...
			 *		...
			 *	}
			 */

			const id = account.user_id || account.id;

			if (id) {
				return dataSources.accountsAPI
					.getAccountById(id)
					.then((result) => result.blocked);
			}

			return account.blocked;
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
		async deleteAccount(
			parent,
			{ where: { id } },
			{ dataSources, queues },
			info
		) {
			const accountDeleted = await dataSources.accountsAPI.deleteAccount(
				id
			);

			if (accountDeleted) {
				await queues.deleteAccountQueue.sendMessage(
					JSON.stringify({ accountId: id })
				);
			}

			return accountDeleted;
		},
		updateAccount(parent, { data, where: { id } }, { dataSources }, info) {
			return dataSources.accountsAPI.updateAccount(id, data);
		},
	},
};

export default resolvers;
