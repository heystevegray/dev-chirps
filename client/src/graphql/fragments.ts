import { gql } from "@apollo/client";

export const basicProfile = gql`
	fragment basicProfile on Profile {
		id
		avatar
		description
		fullName
		username
		githubUrl
		isFullNameHidden
	}
`;

export const basicPost = gql`
	fragment basicPost on Post {
		id
		author {
			avatar
			fullName
			username
		}
		createdAt
		isBlocked
		media
		text
	}
`;

export const basicReply = gql`
	fragment basicReply on Reply {
		id
		author {
			avatar
			fullName
			username
		}
		createdAt
		isBlocked
		media
		post {
			id
		}
		postAuthor {
			username
		}
		text
	}
`;

export const postsNextPage = gql`
	fragment postsNextPage on PostConnection {
		pageInfo {
			endCursor
			hasNextPage
		}
	}
`;
export const repliesNextPage = gql`
	fragment repliesNextPage on ReplyConnection {
		pageInfo {
			endCursor
			hasNextPage
		}
	}
`;

export const profilesNextPage = gql`
	fragment profilesNextPage on ProfileConnection {
		pageInfo {
			endCursor
			hasNextPage
		}
	}
`;
