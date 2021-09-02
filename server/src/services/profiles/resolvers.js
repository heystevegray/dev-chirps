import { UserInputError } from "apollo-server";

const resolvers = {
	Profile: {
		__resolveReference(reference, { dataSources }, info) {
			return dataSources.profilesAPI.getProfileById(reference.id);
		},
		account(profile, args, context, info) {
			return { __typename: "Account", id: profile.accountId };
		},
		id(profile, args, context, info) {
			return profile._id;
		},
		viewerIsFollowing(profile, args, { dataSources }, info) {
			return dataSources.profilesAPI.checkViewerFollowsProfile(
				user.sub,
				profile._id
			);
		},
		following(profile, args, { dataSources }, info) {
			return dataSources.profilesAPI.getFollowedProfiles({
				...args,
				following: profile.following,
			});
		},
		username(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * Why is profile.username null when fetching the profile query?
			 * You are extending the Account type that's defined in the Accounts federated schema
			 */

			if (profile.username) {
				return profile.username;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.username);
		},
		avatar(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 */

			if (profile.avatar) {
				return profile.avatar;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.avatar);
		},
		fullName(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 */

			if (profile.fullName) {
				return profile.fullName;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.fullName);
		},
		description(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 */

			if (profile.description) {
				return profile.description;
			}
			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.description);
		},
	},
	Account: {
		profile(account, args, { dataSources }, info) {
			return dataSources.profilesAPI.getProfile({
				accountId: account.id,
			});
		},
	},
	Query: {
		async profile(parent, { username }, { dataSources }, info) {
			const profile = await dataSources.profilesAPI.getProfile({
				username,
			});

			if (!profile) {
				throw new UserInputError("Profile does not exist.");
			}

			return profile;
		},
		profiles(parent, args, { dataSources }, info) {
			return dataSources.profilesAPI.getProfiles(args);
		},
		searchProfiles(
			parent,
			{ after, first, query: { text } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.searchProfiles({
				after,
				first,
				searchString: text,
			});
		},
	},
	Mutation: {
		createProfile(parent, { data }, { dataSources }, info) {
			return dataSources.profilesAPI.createProfile(data);
		},
		updateProfile(
			parent,
			{ data, where: { username: currentUsername } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.updateProfile(currentUsername, data);
		},
		deleteProfile(parent, { where: { username } }, { dataSources }, info) {
			return dataSources.profilesAPI.deleteProfile(username);
		},
		followProfile(
			parent,
			{ data: { followingProfileId }, where: { username } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.followProfile(
				username,
				followingProfileId
			);
		},
		unfollowProfile(
			parent,
			{ data: { followingProfileId }, where: { username } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.unfollowProfile(
				username,
				followingProfileId
			);
		},
	},
};

export default resolvers;
