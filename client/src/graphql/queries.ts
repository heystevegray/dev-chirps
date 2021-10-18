import { gql } from "@apollo/client";

import {
	basicPost,
	basicProfile,
	basicReply,
	postsNextPage,
	profilesNextPage,
	repliesNextPage,
} from "./fragments";

export const GET_PROFILE = gql`
	query GET_PROFILE($username: String!) {
		profile(username: $username) {
			...basicProfile
			account {
				__typename
				id
				createdAt
				isBlocked
				isModerator
			}
			viewerIsFollowing
		}
	}
	${basicProfile}
`;

export const GET_VIEWER = gql`
	query GET_VIEWER {
		viewer {
			__typename
			id
			createdAt
			email
			isModerator
			profile {
				...basicProfile
			}
		}
	}
	${basicProfile}
`;

export const GET_PROFILE_CONTENT = gql`
	query GET_PROFILE_CONTENT(
		$followingCursor: String
		$postsCursor: String
		$repliesCursor: String
		$username: String!
	) {
		profile(username: $username) {
			id
			pinnedItems {
				id
				description
				name
				primaryLanguage
				url
			}
			following(first: 30, after: $followingCursor) {
				edges {
					node {
						...basicProfile
						viewerIsFollowing
					}
				}
				...profilesNextPage
			}
			posts(first: 30, after: $postsCursor) {
				edges {
					node {
						...basicPost
						id
						author {
							avatar
							fullName
							username
						}
						createdAt
						isBlocked
						text
					}
				}
				...postsNextPage
			}
			replies(first: 30, after: $repliesCursor) {
				edges {
					node {
						...basicReply
					}
				}
				...repliesNextPage
			}
		}
	}
	${basicProfile}
	${basicPost}
	${basicReply}
	${postsNextPage}
	${profilesNextPage}
	${repliesNextPage}
`;

export const GET_POSTS = gql`
	query GET_POSTS($cursor: String, $filter: PostWhereInput) {
		posts(first: 30, after: $cursor, filter: $filter) {
			edges {
				node {
					...basicPost
				}
			}
			...postsNextPage
		}
	}
	${basicPost}
	${postsNextPage}
`;

export const GET_POST = gql`
	query GET_POST($id: ID!, $repliesCursor: String) {
		post(id: $id) {
			...basicPost
			replies(first: 30, after: $repliesCursor) {
				edges {
					node {
						...basicReply
					}
				}
				...repliesNextPage
			}
		}
	}
	${basicPost}
	${basicReply}
	${repliesNextPage}
`;

export const GET_REPLY = gql`
	query GET_REPLY($id: ID!) {
		reply(id: $id) {
			...basicReply
			post {
				...basicPost
			}
		}
	}
	${basicPost}
	${basicReply}
`;

export const SEARCH_POSTS = gql`
	query SEARCH_POSTS($cursor: String, $query: PostSearchInput!) {
		searchPosts(first: 30, after: $cursor, query: $query) {
			edges {
				node {
					...basicPost
					viewerIsFollowing
				}
			}
			...postsNextPage
		}
	}
	${basicPost}
	${postsNextPage}
`;

export const SEARCH_PROFILES = gql`
	query SEARCH_PROFILES($cursor: String, $query: ProfileSearchInput!) {
		searchProfiles(first: 30, after: $cursor, query: $query) {
			edges {
				node {
					...basicProfile
					viewerIsFollowing
				}
			}
			...profilesNextPage
		}
	}
	${basicProfile}
	${profilesNextPage}
`;
