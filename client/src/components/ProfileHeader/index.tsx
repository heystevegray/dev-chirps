import { Box, Button, Heading, Image, Text } from "grommet";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../graphql/types";
import dayjs from "dayjs";
import AccentButton from "../AccentButton";

interface Props {
	profileData: Profile;
}

const ProfileHeader = ({ profileData }: Props) => {
	const { account, avatar, description, fullName, username } = profileData;
	const value = useAuth();
	const { username: viewerUsername } = value.viewerQuery.data.viewer.profile;

	const renderButton = () => {
		if (username === viewerUsername) {
			return <AccentButton label="Edit Profile" />;
		}

		return null;
	};

	return (
		<Box
			align="center"
			border={{ color: "accent-3", size: "medium" }}
			direction="row-responsive"
			pad="medium"
		>
			<Box
				alignSelf="start"
				border={{ color: "brand", size: "small" }}
				height="xsmall"
				margin={{ bottom: "small", right: "medium" }}
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
			<Box basis="1/2" flex={{ grow: 1, shrink: 0 }}>
				{fullName && <Heading level="2">{fullName}</Heading>}
				<Text as="p" color="dark-3" margin={{ bottom: "medium" }}>
					@{username} {account.isModerator && "(Moderator)"}
				</Text>
				<Text as="p" margin={{ bottom: "small" }}>
					{description ? description : "404: description not found."}
				</Text>
				<Text as="p" margin={{ bottom: "small" }}>
					Joined: {dayjs(account.createdAt).format("MMMM YYYY")}
				</Text>
			</Box>
			<Box alignSelf="start">{renderButton()}</Box>
		</Box>
	);
};

export default ProfileHeader;
