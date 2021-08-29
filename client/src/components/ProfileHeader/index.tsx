import { Box, Heading, Image, Text } from "grommet";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../graphql/types";
import dayjs from "dayjs";
import AccentButton from "../AccentButton";
import { useHistory } from "react-router";

interface Props {
	profileData: Profile;
}

const ProfileHeader = ({ profileData }: Props) => {
	const { account, avatar, description, fullName, username } = profileData;
	const value = useAuth();
	const { username: viewerUsername } = value.viewerQuery.data.viewer.profile;

	const history = useHistory();

	const renderButton = () => {
		if (username === viewerUsername) {
			return (
				<AccentButton
					label="Edit Profile"
					onClick={() => {
						history.push("/settings/profile");
					}}
				/>
			);
		}

		return null;
	};

	return (
		<Box
			pad="large"
			alignSelf="center"
			flex={{ grow: 1, shrink: 0 }}
			gap="medium"
			border={{ side: "bottom", color: "brand", size: "small" }}
			direction="row-responsive"
			justify="center"
		>
			<Box gap="medium">
				<Box
					flex={{ grow: 1, shrink: 0 }}
					border={{ color: "brand", size: "small" }}
					height="xsmall"
					overflow="hidden"
					round="full"
					alignSelf="center"
					width="xsmall"
				>
					<Image
						fit="cover"
						src={avatar}
						alt={`${fullName} profile image`}
					/>
				</Box>
				<Text as="p" textAlign="center" color="dark-4">
					@{username} {account.isModerator && "(Moderator)"}
				</Text>
				<Box gap="medium" justify="center" alignSelf="center" margin={{ left: "xlarge", right: "xlarge" }}>
					{fullName && (
						<Heading textAlign="center" level="2">
							{fullName}
						</Heading>
					)}
					<Text as="p" textAlign="center">
						{description
							? description
							: "404: description not found."}
					</Text>
					<Text as="p" color="dark-4" textAlign="center">
						Joined: {dayjs(account.createdAt).format("MMMM YYYY")}
					</Text>
					<Box margin={{ top: "large" }} alignSelf="center">
						{renderButton()}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ProfileHeader;
