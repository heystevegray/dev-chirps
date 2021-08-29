import { gql } from "@apollo/client";

import { basicPost, basicProfile, basicReply } from "./fragments";

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
	query GET_PROFILE_CONTENT($username: String!) {
		profile(username: $username) {
			id
			following(first: 30) {
				edges {
					node {
						...basicProfile
					}
				}
			}
			posts(first: 30) {
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
			}
			replies(first: 30) {
				edges {
					node {
						...basicReply
					}
				}
			}
		}
	}
	${basicProfile}
	${basicPost}
	${basicReply}
`;
