import { gql } from "@apollo/client";

import { basicProfile } from "./fragments";

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
