import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Account @key(fields: "id") {
		id: ID! @external
		"Metadata about the user that owns this account."
		profile: Profile
	}

	"""
	The file upload type built into Apollo Server 2.0+
	"""
	scalar Upload

	"""
	A list of profile edges with pagination information.
	"""
	type ProfileConnection {
		"A list of profile edges."
		edges: [ProfileEdge]
		"Information to assist with pagination."
		pageInfo: PageInfo!
	}

	"""
	A single Profile node with its cursor.
	"""
	type ProfileEdge {
		"A cursor for use in pagination."
		cursor: ID!
		"A profile at the end of an edge."
		node: Profile!
	}

	"""
	Information about pagination in a connection.
	"""
	type PageInfo {
		"The cursor to continue from when paginating forward."
		endCursor: String
		"Whether there are more items when paginating forward."
		hasNextPage: Boolean!
		"Whether there are more items when paginating backward."
		hasPreviousPage: Boolean!
		"The cursor to continue from when paginating backward."
		startCursor: String
	}

	"""
	Sorting options for profile connections.
	"""
	enum ProfileOrderByInput {
		"Order profiles ascending by username."
		username_ASC
		"Order profiles descending by username."
		username_DESC
	}

	"""
	Provides the unique MongoDB document ID of an existing profile.
	"""
	input FollowingProfileInput {
		"The unique profile id of the user to be followed or unfollowed."
		followingProfileId: ID!
	}

	"""
	Provides the unique username of an existing profile.
	"""
	input ProfileWhereUniqueInput {
		"The unique username of the user."
		username: String!
	}

	"""
	Provides data to update and existing profile.
	"""
	input UpdateProfileInput {
		"The updated avatar with the stream, filename, mimetype, and encoding."
		avatar: Upload
		"The updated user description."
		description: String
		"The updated full name of the user."
		fullName: String
		"The updated unique username of the user."
		username: String
	}

	"""
	Provides a search string to query users by username or full names.
	"""
	input ProfileSearchInput {
		"The text string to search for in usernames or full names."
		text: String!
	}

	"""
	Provides data to create a new user profile.
	"""
	input CreateProfileInput {
		"The new user's unique Auth0 ID."
		accountId: ID!
		"A short bio or description about the user (max. 256 characters)."
		description: String
		"The new user's full name."
		fullName: String
		"The new user's username (must be unique)."
		username: String!
	}

	"""
	Profile Entity
	The Accounts type above is a "stub" of the Account entity

	A profile contains metadata about a specific user.
	"""
	type Profile @key(fields: "id") {
		"The unique MongoDB document ID of this user's profile."
		id: ID!
		"The Auth0 account tied to this profile."
		account: Account!
		"The URL of the user's avatar."
		avatar: String
		"A short bio or description about the user (max. 256 characters)."
		description: String
		"Other users that the users follows."
		following(
			first: Int
			after: String
			last: Int
			before: String
			orderBy: ProfileOrderByInput
		): ProfileConnection
		"The full name of the user."
		fullName: String
		"The unique username of the user."
		username: String!
		"Whether the currently logged in user follows this profile."
		viewerIsFollowing: Boolean
	}

	extend type Query {
		"Retrieves a single profile by username."
		profile(username: String!): Profile!

		"Retrieves a list of profiles."
		profiles(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: ProfileOrderByInput
		): ProfileConnection

		"""
		Performs a search of user profiles.

		We left out the before and last arguments that enable backward pagination. That means we’re deviating from the Relay pagination specification slightly, but there are two good reasons for doing so. The first reason is that when using MongoDB’s full-text search the matching documents are sorted in descending order by their relevance. For most use cases of full-text search, it’s hard to imagine a scenario where a user would want to search for and retrieve some items from a database only to see the least relevant documents first.

		The second reason has to do with how we get MongoDB to sort the documents in order of their relevance. We use the { $meta: "textScore" } expression to sort the most relevant documents first (rather than using a 1 or -1 to indicate the sort direction on a specific field as we have previously). However, in doing so we allow the $meta expression to assume full control over the sort order, which is descending only. There is no simple way to flip the sort order of these documents as we have done with other paginated queries.

		Ultimately, hacking around this MongoDB default doesn’t make much sense given that, again, it’s very hard to imagine scenarios where a user would want to see the least relevant results first. Additionally, and for the same reasons, the searchProfiles query omits what becomes a redundant orderBy argument.
		"""
		searchProfiles(
			after: String
			first: Int
			query: ProfileSearchInput!
		): ProfileConnection
	}

	extend type Mutation {
		"Creates a new profile tied to an Auth0 account."
		createProfile(data: CreateProfileInput!): Profile!
		"Updates a user's profile details."
		updateProfile(
			data: UpdateProfileInput!
			where: ProfileWhereUniqueInput!
		): Profile!
		"Deletes a user profile."
		deleteProfile(where: ProfileWhereUniqueInput!): ID!
		"Allows one user to follow another."
		followProfile(
			data: FollowingProfileInput!
			where: ProfileWhereUniqueInput!
		): Profile!
		"Allows one user to unfollow another."
		unfollowProfile(
			data: FollowingProfileInput!
			where: ProfileWhereUniqueInput!
		): Profile!
	}
`;

export default typeDefs;
