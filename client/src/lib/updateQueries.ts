import { ApolloCache, InMemoryCache } from "@apollo/client";
import { GET_PROFILE_CONTENT, SEARCH_PROFILES } from "../graphql/queries";
import { ProfileNode } from "../graphql/types";
import update from "immutability-helper";

export const updateFieldPageResults = (
	field: string,
	fetchMoreResult: any,
	previousResult: any
) => {
	const { edges: newEdges, pageInfo } = fetchMoreResult[field];

	return newEdges.length
		? {
				[field]: {
					__typename: previousResult[field].__typename,
					edges: [...previousResult[field].edges, ...newEdges],
					pageInfo,
				},
		  }
		: previousResult;
};

export const updateSubfieldPageResults = (
	field: string,
	subfield: string,
	fetchMoreResult: any,
	previousResult: any
) => {
	const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];
	const previousEdges = previousResult[field][subfield].edges;

	return newEdges.length
		? {
				[field]: {
					...previousResult[field],
					[subfield]: {
						__typename: previousResult[field][subfield].__typename,
						edges: [...previousEdges, ...newEdges],
						pageInfo,
					},
				},
		  }
		: previousResult;
};

export const updateProfileContentFollowing = (
	cache: ApolloCache<InMemoryCache>,
	followingId: string,
	username: string
) => {
	// @ts-ignore
	let { profile } = cache.readQuery({
		query: GET_PROFILE_CONTENT,
		variables: { username },
	});

	const followingIndex = profile.following.edges.findIndex(
		(item: ProfileNode) => item.node.id === followingId
	);

	const isFollowing =
		profile.following.edges[followingIndex].node.viewerIsFollowing;

	const updatedProfile = update(profile, {
		following: {
			edges: {
				[followingIndex]: {
					node: { viewerIsFollowing: { $set: !isFollowing } },
				},
			},
		},
	});

	cache.writeQuery({
		query: GET_PROFILE_CONTENT,
		data: { profile: updatedProfile },
	});
};

export function updateSearchProfilesFollowing(
	cache: ApolloCache<InMemoryCache>,
	followingId: string,
	text: string
) {
	// @ts-ignore
	let { searchProfiles } = cache.readQuery({
		query: SEARCH_PROFILES,
		variables: { query: { text } },
	});
	const followingIndex = searchProfiles.edges.findIndex(
		(item: ProfileNode) => item.node.id === followingId
	);
	const isFollowing =
		searchProfiles.edges[followingIndex].node.viewerIsFollowing;
	const updatedSearchProfiles = update(searchProfiles, {
		edges: {
			[followingIndex]: {
				node: { viewerIsFollowing: { $set: !isFollowing } },
			},
		},
	});

	cache.writeQuery({
		query: SEARCH_PROFILES,
		data: { searchProfiles: updatedSearchProfiles },
	});
}
