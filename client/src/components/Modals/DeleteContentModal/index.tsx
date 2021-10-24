import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "grommet";
import { Trash } from "grommet-icons";
import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { DELETE_POST, DELETE_REPLY } from "../../../graphql/mutations";
import {
	GET_POST,
	GET_POSTS,
	GET_PROFILE_CONTENT,
} from "../../../graphql/queries";
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

	const [deletePost, { loading }] = useMutation(DELETE_POST, {
		onCompleted,
		refetchQueries: () => [
			{
				query: GET_POSTS,
				variables: {
					filter: {
						followedBy: username,
						includeBlocked: false,
					},
				},
			},
			{ query: GET_PROFILE_CONTENT, variables: { username } },
		],
	});
	const [deleteReply] = useMutation(DELETE_REPLY, {
		onCompleted,
		refetchQueries: () => [
			...(parentPostId
				? [{ query: GET_POST, variables: { id: parentPostId } }]
				: []),
			{
				query: GET_PROFILE_CONTENT,
				variables: { username },
			},
		],
	});

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
						disabled={loading}
						color="status-critical"
						label="Delete"
						primary
						onClick={() => {
							if (isReply) {
								deleteReply({
									variables: {
										where: { id },
									},
								}).catch((error) => {
									console.error(error);
								});
							} else {
								deletePost({
									variables: {
										where: { id },
									},
								}).catch((error) => {
									console.error(error);
								});
							}
						}}
					/>
				</Box>
			</Modal>
			<Button
				tip="Delete"
				a11yTitle="Delete"
				hoverIndicator
				icon={<Trash color="status-critical" size={iconSize} />}
				onClick={() => setModalOpen(true)}
			/>
		</Box>
	);
};

export default DeleteContentModal;
