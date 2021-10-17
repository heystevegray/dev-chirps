import { Anchor, Box, Heading, Text } from "grommet";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../graphql/types";
import dayjs from "dayjs";
import { useHistory } from "react-router";
import Avatar from "../Avatar";
import AccentButton from "../Buttons/AccentButton";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from "../../graphql/mutations";
import NotAvailableMessage from "../NotAvailableMessage";
import AccountBlockButton from "../Buttons/AccountBlockedButton";
import ModeratorRoleButton from "../Buttons/ModeratorRoleButton";
import { Github } from "grommet-icons";

interface Props {
	profileData: Profile;
	refetchProfile: (
		variables?:
			| Partial<{
					username: any;
			  }>
			| undefined
	) => Promise<ApolloQueryResult<any>>;
}

const ProfileHeader = ({ profileData, refetchProfile }: Props) => {
	const history = useHistory();
	const value = useAuth();
	const {
		account,
		avatar,
		description,
		fullName,
		username,
		viewerIsFollowing,
		id,
		githubUrl,
	} = profileData;
	const {
		isModerator: viewerIsModerator,
		profile: { username: viewerUsername },
	} = value.viewerQuery.data.viewer;

	const [followProfile, { loading }] = useMutation(FOLLOW_PROFILE);
	const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

	const variables = {
		data: {
			followingProfileId: id,
		},
		where: {
			username: viewerUsername,
		},
	};

	const renderButton = () => {
		let label, onClick;

		if (username === viewerUsername) {
			label = "Edit Profile";
			onClick = () => {
				history.push("/settings/profile");
			};
		} else if (viewerIsFollowing) {
			label = "Unfollow";
			onClick = () => {
				unfollowProfile({ variables });
				refetchProfile();
			};
		} else {
			label = "Follow";
			onClick = () => {
				followProfile({ variables });
				refetchProfile();
			};
		}

		return (
			<Box alignSelf="center">
				<AccentButton
					disabled={loading}
					label={label}
					onClick={onClick}
					primary
				/>
			</Box>
		);
	};

	return (
		<Box
			pad={{ top: "medium", right: "medium", left: "medium" }}
			alignSelf="center"
			flex={{ grow: 1, shrink: 0 }}
			gap="medium"
			border={{ side: "bottom", color: "brand", size: "small" }}
			direction="row-responsive"
			justify="center"
		>
			<Box gap="medium">
				<Box alignSelf="center">
					<Avatar fullName={fullName} avatar={avatar} size="xlarge" />
				</Box>
				<Box align="center" direction="row" justify="center">
					<Text as="p" textAlign="center" color="dark-4">
						@{username} {account.isModerator && `(Moderator)`}
					</Text>
					{githubUrl && (
						<Anchor href={githubUrl} margin={{ left: "small" }}>
							<Github color="secondary" size="30px" />
						</Anchor>
					)}
				</Box>

				<Box
					gap="medium"
					justify="center"
					alignSelf="center"
					margin={{
						left: "xlarge",
						right: "xlarge",
						bottom: "medium",
					}}
				>
					{fullName && (
						<Heading textAlign="center" level="2">
							{fullName}
						</Heading>
					)}
					{account.isBlocked && (
						<Box align="center">
							<NotAvailableMessage text="This account has been temporarily suspended." />
						</Box>
					)}
					<Text as="p" textAlign="center">
						{description
							? description
							: "404: description not found."}
					</Text>
					<Box
						align="center"
						direction="row-responsive"
						gap="small"
						justify="center"
					>
						<Text as="p" color="dark-4" textAlign="center">
							Joined: {dayjs().format("MMMM YYYY")}
						</Text>
						<Box direction="row" align="center" justify="center">
							{viewerIsModerator &&
								username !== viewerUsername && (
									<AccountBlockButton
										accountId={account.id}
										iconSize="18px"
										isBlocked={account.isBlocked}
									/>
								)}
							{viewerIsModerator && (
								<ModeratorRoleButton
									label={`Change ${
										fullName || `@${username}`
									}'s Moderator Role`}
									accountId={account.id}
									iconSize="18px"
									isModerator={account.isModerator}
								/>
							)}
						</Box>
					</Box>
					{renderButton()}
				</Box>
			</Box>
		</Box>
	);
};

export default ProfileHeader;
