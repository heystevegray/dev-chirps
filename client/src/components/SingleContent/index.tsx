import { Box, Text, Anchor, Image } from "grommet";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Content } from "../../graphql/types";
import { displayFullDatetime } from "../../lib/displayDatetime";
import Avatar from "../Avatar";
import ContentBlockButton from "../Buttons/ContentBlockButton";
import DeleteContentModal from "../Modals/DeleteContentModal";
import NewReplyModal from "../Modals/NewReplyModal";
import NotAvailableMessage from "../NotAvailableMessage";

export const getPostAuthorUsername = (parentPostAuthor: {
	username?: string;
}) => {
	// If an account has been deleted, the parentPostAuthor username will not exist
	if (parentPostAuthor) {
		if (parentPostAuthor.username) {
			return (
				<Text as="p">
					<Text color="dark-3">Replying to </Text>
					<Link to={`/profile/${parentPostAuthor.username}`}>
						<Anchor as="span">@{parentPostAuthor.username}</Anchor>
					</Link>
				</Text>
			);
		}

		return (
			<Text as="p">
				<Text color="dark-3">
					Replying to{" "}
					<Text color="status-error">
						an account that no longer exists 😬
					</Text>
				</Text>
			</Text>
		);
	}

	return null;
};

const SingleContent = ({ contentData }: { contentData: Content }) => {
	const value = useAuth();
	const {
		isModerator,
		profile: { username },
	} = value.viewerQuery.data.viewer;
	const {
		author,
		id,
		createdAt,
		isBlocked,
		post: parentPost,
		text,
		media,
		postAuthor: parentPostAuthor,
	} = contentData;

	return (
		<Box
			border={{
				color: "dark-1",
				size: "xsmall",
				style: "solid",
				side: "bottom",
			}}
			margin={{ top: "medium" }}
			pad={{ bottom: "large" }}
		>
			<Box direction="row" gap="medium">
				<Avatar
					avatar={author.avatar}
					fullName={author.fullName}
					size="xlarge"
				/>
				<Box justify="center">
					<Text weight="bold">{author.fullName}</Text>
					<Text as="p">
						<Link to={`/profile/${author.username}`}>
							<Anchor color="brand" as="span">
								@{author.username}
							</Anchor>
						</Link>
					</Text>
				</Box>
			</Box>
			<Box margin={{ top: "medium" }}>
				{getPostAuthorUsername(parentPostAuthor)}
				{isBlocked && (
					<NotAvailableMessage
						margin={{ bottom: "small", top: "xsmall" }}
						text="Oof. This content was blocked by a moderator."
					/>
				)}
				{(!isBlocked || author.username === username) && (
					<Box>
						<Text as="h2" size="xlarge">
							{text}
						</Text>
						{media && (
							<Box direction="row" justify="center">
								<Image
									margin={{ top: "small" }}
									src={media}
									alt="Content image"
								/>
							</Box>
						)}
					</Box>
				)}
			</Box>
			<Box
				align="center"
				direction="row"
				margin={{ top: "small" }}
				gap="small"
			>
				<Text as="p" color="dark-3" size="small">
					{displayFullDatetime(createdAt)}
				</Text>
				{author.username === username && (
					<DeleteContentModal
						iconSize="18px"
						id={id}
						isReply={parentPost !== undefined}
						parentPostId={parentPost && parentPost.id}
					/>
				)}
				{isModerator && username !== author.username && (
					<ContentBlockButton
						iconSize="18px"
						id={id}
						isBlocked={isBlocked}
						isReply={parentPost !== undefined}
					/>
				)}
			</Box>
			{parentPostAuthor === undefined && !isBlocked && (
				<Box margin={{ top: "medium" }} align="end">
					<NewReplyModal
						iconSize="18px"
						postData={{ author, createdAt, id, text }}
					/>
				</Box>
			)}
		</Box>
	);
};

export default SingleContent;
