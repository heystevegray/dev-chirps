import { Box, Text } from "grommet";
import { useHistory } from "react-router";
import { Profile } from "../../../graphql/types";
import AccentButton from "../../Buttons/AccentButton";
import HoverBox from "../../HoverBox";
import UsernameHeader from "../../UsernameHeader";
import ListItem from "../ListItem";

const ProfileListItem = ({ profileData }: { profileData: Profile }) => {
	const { avatar, description, fullName, username } = profileData;
	const history = useHistory();

	return (
		<HoverBox
			onClick={() => {
				history.push(`/profile/${username}`);
			}}
			pad={{ left: "small", top: "medium", right: "small" }}
		>
			<ListItem fullName={fullName} avatar={avatar}>
				<Box
					flex={{ grow: 1, shrink: 0 }}
					margin={{ bottom: "medium" }}
				>
					<UsernameHeader fullName={fullName} username={username} />
					<Text as="p" margin={{ bottom: "small", top: "small" }}>
						{description}
					</Text>
				</Box>
				<Box>
					<AccentButton
						background="secondary"
						label="Unfollow"
						onClick={(event: any) => {
							event.stopPropagation();
							console.log("Clicked");
						}}
					/>
				</Box>
			</ListItem>
		</HoverBox>
	);
};

export default ProfileListItem;
