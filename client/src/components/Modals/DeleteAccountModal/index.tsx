import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "grommet";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { DELETE_ACCOUNT } from "../../../graphql/mutations";
import AccentButton from "../../Buttons/AccentButton";
import Modal from "../../Modal";

const DeleteAccountModal = ({ accountId }: { accountId: string }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const { logout } = useAuth();

	const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
		onCompleted: logout,
	});

	return (
		<Box>
			<Box direction="row">
				<Modal
					handleClose={() => {
						setModalOpen(false);
					}}
					isOpen={modalOpen}
					title="Please Confirm"
					width="medium"
				>
					<Text as="p">
						Are you sure you want to permanently delete your account
						and all of its content?
					</Text>
					<Text as="p">This action cannot be reversed.</Text>
					<Text as="p">Confirm you want to burn it all.</Text>
					<Box direction="row" justify="center">
						<AccentButton
							color="status-critical"
							disabled={loading}
							label="🔥 BURN IT ALL 🔥"
							onClick={() => {
								deleteAccount({
									variables: { where: { id: accountId } },
								});
							}}
						/>
					</Box>
				</Modal>
			</Box>
			<Box align="center" direction="row" justify="end">
				<AccentButton
					color="status-critical"
					label="Delete Account"
					onClick={() => {
						setModalOpen(true);
					}}
				/>
			</Box>
		</Box>
	);
};

export default DeleteAccountModal;
