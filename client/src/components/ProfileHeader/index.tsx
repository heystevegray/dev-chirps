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
			margin={{ top: "xlarge" }}
			alignSelf="center"
			flex={{ grow: 1, shrink: 0 }}
			gap="large"
			direction="row-responsive"
			justify="center"
		>
			<Box>
				<Box
					align="center"
					direction="row-responsive"
					pad="medium"
					alignSelf="center"
					gap="medium"
				>
					<Box gap="small">
						<Box
							alignSelf="center"
							border={{ color: "brand", size: "small" }}
							height="xsmall"
							overflow="hidden"
							round="full"
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
						<Text as="p" textAlign="center" color="dark-4">
							Joined:{" "}
							{dayjs(account.createdAt).format("MMMM YYYY")}
						</Text>
					</Box>
				</Box>
				<Box
					gap="medium"
					justify="center"
					alignSelf="center"
					margin={{ left: "large", right: "large" }}
				>
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
				</Box>
			</Box>
			<Box margin={{ top: "xlarge" }} alignSelf="center">
				{renderButton()}
			</Box>
		</Box>
	);
};

export default ProfileHeader;
