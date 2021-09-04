import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "grommet";
import { Trash } from "grommet-icons";
import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { DELETE_POST, DELETE_REPLY } from "../../../graphql/mutations";
import Modal from "../../Modal";

interface Props {
	iconSize: string;
	isReply: boolean;
	parentPostId: string | null;
	id: string;
}

const DeleteContentModal = ({
	iconSize = "small",
	id,
	isReply = false,
	parentPostId,
}: Props) => {
	const history = useHistory();
	const [modalOpen, setModalOpen] = useState(false);
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;

	const onCompleted = () => {
		setModalOpen(false);
		history.push("/home");
	};

	const [deletePost, { loading }] = useMutation(DELETE_POST, { onCompleted });
	const [deleteReply] = useMutation(DELETE_REPLY, { onCompleted });

	return (
		<Box direction="row" onClick={(event: any) => event.stopPropagation()}>
			<Modal
				handleClose={() => setModalOpen(false)}
				isOpen={modalOpen}
				title="Please Confirm"
				width="medium"
			>
				<Text as="p">
					{`Are you sure you want to permanently delete this ${
						isReply ? "reply" : "post"
					}?`}
				</Text>
				<Box direction="row" justify="end">
					<Button
						color="status-critical"
						label="Delete"
						primary
						onClick={() => {
							if (isReply) {
								deleteReply({
									variables: {
										where: { id },
									},
								}).catch((err) => {
									console.log(err);
								});
							} else {
								deletePost({
									variables: {
										where: { id },
									},
								}).catch((err) => {
									console.log(err);
								});
							}
						}}
					/>
				</Box>
			</Modal>
			<Button
				a11yTitle="Delete"
				hoverIndicator
				icon={<Trash color="status-critical" size={iconSize} />}
				onClick={() => setModalOpen(true)}
			/>
		</Box>
	);
};

export default DeleteContentModal;
