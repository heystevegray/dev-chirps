import { useState } from "react";
import Modal from "../../../components/Modal";

const Profile = ({ history }: { history: any }) => {
	const [modalOpen, setModalOpen] = useState(true);

	return (
		<Modal
			handleClose={() => {
				setModalOpen(false);
				history.push("/profile");
			}}
			isOpen={modalOpen}
			title="Create Profile"
			width="600px"
		>
			<p>The profile settings form goes here...</p>
		</Modal>
	);
};

export default Profile;
