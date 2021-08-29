import { Anchor, Box, Text } from "grommet";
import { Profile } from "../../../graphql/types";
import AccentButton from "../../AccentButton";
import Avatar from "../../Avatar";
import UsernameHeader from "../../UsernameHeader";
import ListItem from "../ListItem";

const ProfileListItem = ({ profileData }: { profileData: Profile }) => {
	const { avatar, description, fullName, username } = profileData;

	return (
		<ListItem fullName={fullName} avatar={avatar}>
			<Box flex={{ grow: 1, shrink: 0 }} margin={{ bottom: "medium" }}>
				<UsernameHeader fullName={fullName} username={username} />
				<Text as="p" margin={{ bottom: "small", top: "small" }}>
					{description}
				</Text>
			</Box>
			<Box>
				<AccentButton
					label="Unfollow"
					onClick={() => {
						console.log("Clicked");
					}}
				/>
			</Box>
		</ListItem>
	);
};

export default ProfileListItem;
