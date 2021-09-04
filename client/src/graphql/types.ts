import { ReactElement } from "react";
import { match as MatchInterface } from "react-router";

export type SearchTypes = "searchPosts" | "searchProfiles";
export interface Profile extends IsModerator, IsBlocked {
	id: string;
	account: Account;
	avatar: string;
	description: string;
	following: string[];
	fullName: string;
	username: string;
	viewerIsFollowing: boolean;
}

export type Children = ReactElement | ReactElement[] | null;

export interface MatchUsername {
	match: MatchInterface<{ username?: string }>;
}

export interface MatchId {
	match: MatchInterface<{ id?: string }>;
}
export interface Account extends IsModerator, IsBlocked {
	id: string;
	createdAt: Date;
	email: string;
	profile: Profile;
}

interface IsBlocked {
	isBlocked: boolean;
}

interface IsModerator {
	isModerator: boolean;
}

export type Viewer = {
	id: string;
	createdAt: Date;
	email: string;
	profile: Profile;
};

export interface AuthProps {
	checkingSession: boolean;
	getToken: (options: any) => boolean;
	login: (options: any) => void;
	logout: (options: any) => void;
	updateViewer: (viewer: Viewer) => void;
}

export interface ProfileNode {
	node: Profile;
}

export interface ContentNode {
	node: Content;
}
export interface Content extends Post {
	isBlocked: boolean;
	postAuthor: any;
}

export interface Post {
	id: string;
	author: Author;
	createdAt: Date;
	text: string;
}

export interface Author {
	avatar: string;
	fullName: string;
	username: string;
}

export interface QueryResults {
	searchPosts: ContentNode[];
	searchProfiles: ProfileNode[];
}
