import { Box, Text } from "grommet";
import { ReactElement, useRef, useState } from "react";
import { Redirect } from "react-router";
import CreateProfileForm from "../../../components/CreateProfileForm";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthContext";

const Profile = ({ history }: { history: any }): ReactElement => {
	const [modalOpen, setModalOpen] = useState(true);
	const { viewerQuery, updateViewer } = useAuth();
	const { id, profile } = viewerQuery.data.viewer;
	const profileRef = useRef(profile);

	if (!profileRef.current && profile) {
		return <Redirect to={"/profile"} />;
	}

	return (
		<Modal
			handleClose={
				profile &&
				(() => {
					setModalOpen(false);
					history.push(`/profile/${profile.username}`);
				})
			}
			isOpen={modalOpen}
			title={profile ? "Edit Profile" : "Create Profile"}
			width="600px"
		>
			<Box gap="medium">
				<Text as="p" textAlign="center">
					{profile
						? "Update your user information below:"
						: "Please create your user profile before proceeding:"}
				</Text>
				{profile && (
					<CreateProfileForm
						accountId={id}
						updateViewer={updateViewer}
					/>
				)}
			</Box>
		</Modal>
	);
};

export default Profile;
