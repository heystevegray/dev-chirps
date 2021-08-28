export type Profile = {
	id: string;
	account: Account;
	avatar: string;
	description: string;
	following: string[];
	fullName: string;
	username: string;
	viewerIsFollowing: boolean;
};

export type Account = {
	id: string;
	createdAt: Date;
	email: string;
	isBlocked: boolean;
	isModerator: boolean;
};
