import { UserInputError } from "apollo-server";

import auth0 from "../../config/auth0";
import getToken from "../../lib/getToken";

const resolvers = {
	Account: {
		__resolveReference(reference, context, info) {
			return auth0.getUser({ id: reference.id });
		},
		id(account, args, context, info) {
			return account.user_id;
		},
		createdAt(account, args, context, info) {
			return account.created_at;
		},
		isModerator(account, args, context, info) {
			return (
				account.app_metadata &&
				account.app_metadata.roles &&
				account.app_metadata.roles.includes('moderator')
			)
		}
	},
	Query: {
		account(parent, { id }, context, info) {
			return auth0.getUser({ id });
		},
		accounts(parent, { id }, context, info) {
			return auth0.getUsers();
		},
		viewer(parent, args, { user }, info) {
			if (user && user.sub) {
				return auth0.getUser({ id: user.sub });
			}
			return null;
		},
	},
	Mutation: {
		createAccount(parent, { data: { email, password } }, context, info) {
			return auth0.createUser({
				connection: "Username-Password-Authentication",
				email,
				password,
			});
		},
		async deleteAccount(parent, { where: { id } }, context, info) {
			await auth0.deleteUser({ id })
			return true
		},
		async updateAccount(
			parent,
			{ data: { email, newPassword, password }, where: { id } },
			context,
			info
		) {
			// Handle user input-related errors:
			// -> Throw and error if no email or password was submitted
			// -> Throw and error if both an email or password was submitted
			// -> Throw and error if an existing password was submitted without a new password, or a new password was submitted without an existing password
			// If no email was submitted, we know we're updating the password:
			// -> Make a request to Auth0 to ensure we can authenticate the user with the existing password they submitted
			// -> Call Auth0's update user method to update the password
			// We know we have an email, so update it:
			// -> Call Auth0s's update user method to update the email
			if (!email && !newPassword && !password) {
				throw new UserInputError(
					"You must supply some account data to update."
				);
			} else if (email && newPassword && password) {
				throw new UserInputError(
					"Email and password cannot be updated simultaneously."
				);
			} else if (
				(!password && newPassword) ||
				(password && !newPassword)
			) {
				throw new UserInputError(
					"Provide the existing and new passwords when updating the password"
				);
			}
			if (!email) {
				const user = await auth0.getUser({ id });
				await getToken(user.email, password);
				return auth0.updateUser({ id }, { password: newPassword });
			}

			return auth0.updateUser(
				{ id },
				{
					email,
				}
			);
		},
	},
};

export default resolvers;
