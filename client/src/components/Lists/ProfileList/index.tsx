import { Box } from "grommet";
import { ProfileNode } from "../../../graphql/types";
import ProfileListItem from "../../ListItems/ProfileListItem";

export interface ProfileProps {
	profileData: ProfileNode[];
}

const ProfileList = ({ profileData }: ProfileProps) => (
	<Box>
		{profileData.map((itemProfileData: ProfileNode) => (
			<ProfileListItem
				profileData={itemProfileData.node}
				key={itemProfileData.node.id}
			/>
		))}
	</Box>
);

export default ProfileList;
