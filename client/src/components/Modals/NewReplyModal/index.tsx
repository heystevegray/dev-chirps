import { Box, Text } from "grommet";
import { ChatOption } from "grommet-icons";
import { useState } from "react";
import { Post } from "../../../graphql/types";
import { displayRelativeDateOrTime } from "../../../lib/displayDatetime";
import Avatar from "../../Avatar";
import AccentButton from "../../Buttons/AccentButton";
import CreateContentForm from "../../Forms/CreateContentForm";
import Modal from "../../Modal";
import UsernameHeader from "../../UsernameHeader";

interface Props {
	iconSize: string;
	showButtonLabel?: boolean;
	postData: Post;
}

const NewReplyModal = ({
	iconSize = "small",
	postData,
	showButtonLabel = true,
}: Props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const { author, createdAt, id, text } = postData;

	return (
		<Box
			direction="row"
			onClick={(event: any) => {
				event.stopPropagation();
			}}
		>
			<Modal
				handleClose={() => setModalOpen(false)}
				isOpen={modalOpen}
				title="Create a New Reply"
				width="large"
			>
				<Box height={{ min: "132px" }} margin={{ vertical: "small" }}>
					<Box direction="row" gap="medium">
						<Box
							height="48px"
							overflow="hidden"
							round="full"
							width={{ min: "48px" }}
						>
							<Avatar
								fullName={author.fullName}
								avatar={author.avatar}
							/>
						</Box>
						<Box>
							<UsernameHeader
								fullName={author.fullName}
								username={author.username}
							/>
							<Text as="p" margin={{ top: "small" }}>
								{text}
							</Text>
							<Text
								as="p"
								color="dark-3"
								size="small"
								margin={{ top: "small" }}
							>
								{displayRelativeDateOrTime(createdAt)}
							</Text>
						</Box>
					</Box>
					<Text as="p" margin={{ top: "medium" }}>
						<Text color="dark-3">
							Replying to @{author.username}
						</Text>
					</Text>
				</Box>
				<CreateContentForm parentPostId={id} />
			</Modal>
			<AccentButton
				hoverIndicator={!showButtonLabel}
				a11yTitle="Reply"
				tip={!showButtonLabel ? "Reply" : ""}
				icon={
					<ChatOption
						color={showButtonLabel ? "paper" : "brand"}
						size={iconSize}
					/>
				}
				label={showButtonLabel && "Reply"}
				onClick={() => setModalOpen(!modalOpen)}
				primary={showButtonLabel}
			/>
		</Box>
	);
};

export default NewReplyModal;
