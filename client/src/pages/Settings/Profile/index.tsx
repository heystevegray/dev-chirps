import { Box, Text } from "grommet";
import { ReactElement, useState } from "react";
import CreateProfileForm from "../../../components/CreateProfileForm";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthContext";

const Profile = ({ history }: { history: any }): ReactElement => {
	const [modalOpen, setModalOpen] = useState(true);
	const { viewerQuery, updateViewer } = useAuth();
	const { id, profile } = viewerQuery.data.viewer;
	console.log({ profile });

	return (
		<Modal
			handleClose={
				profile &&
				(() => {
					setModalOpen(false);
					history.push("/profile");
				})
			}
			isOpen={modalOpen}
			title={profile ? "Edit Profile" : "Create Profile"}
			width="600px"
		>
			<Text as="p" textAlign="center">
				{profile
					? "Update your user information below:"
					: "Please create your user profile before proceeding:"}
			</Text>
			{profile ?? (
				<CreateProfileForm accountId={id} updateViewer={updateViewer} />
			)}
		</Modal>
	);
};

export default Profile;
