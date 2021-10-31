import { Box, ResponsiveContext, Text } from "grommet";
import { ChatOption } from "grommet-icons";
import { useContext, useState } from "react";
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
	const sizeSmall = useContext(ResponsiveContext) === "small";
	const gap = sizeSmall ? "medium" : "small";

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<Box
			direction="row"
			onClick={(event: any) => {
				event.stopPropagation();
			}}
		>
			<Modal
				handleClose={handleClose}
				isOpen={modalOpen}
				title="Create a New Reply"
				width="large"
			>
				<Box gap={gap}>
					<Box margin={{ vertical: "small" }} gap={gap}>
						<Box direction="row" gap={gap}>
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
					</Box>
					<Box background="dark-1" gap={gap}>
						<Box pad={{ vertical: sizeSmall ? "large" : "small" }}>
							<Text as="p">
								<Text color="dark-3">
									Replying to @{author.username}
								</Text>
							</Text>
						</Box>
						<Box>
							<CreateContentForm
								parentPostId={id}
								handleClose={handleClose}
							/>
						</Box>
					</Box>
				</Box>
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
