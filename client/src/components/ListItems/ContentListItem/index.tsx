import { Box, Text, Anchor, Image } from "grommet";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Content } from "../../../graphql/types";
import { displayRelativeDateOrTime } from "../../../lib/displayDatetime";
import HoverBox from "../../HoverBox";
import DeleteContentModal from "../../Modals/DeleteContentModal";
import NewReplyModal from "../../Modals/NewReplyModal";
import NotAvailableMessage from "../../NotAvailableMessage";
import UsernameHeader from "../../UsernameHeader";
import ListItem from "../ListItem";

const ContentListItem = ({ contentData }: { contentData: Content }) => {
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;
	const history = useHistory();

	const {
		id,
		author,
		createdAt,
		isBlocked,
		post: parentPost,
		media,
		postAuthor: parentPostAuthor,
		text,
	} = contentData;

	return (
		<HoverBox
			onClick={() => {
				history.push(
					`/${
						parentPostAuthor !== undefined ? "reply" : "post"
					}/${id}`
				);
			}}
		>
			<ListItem fullName={author.fullName} avatar={author.avatar}>
				<Box flex margin={{ bottom: "medium" }}>
					<UsernameHeader
						fullName={author.fullName}
						username={author.username}
					/>
					{parentPostAuthor && (
						<Text as="p">
							<Text color="dark-2">Replying to </Text>
							<Link to={`/profile/${parentPostAuthor.username}`}>
								<Anchor
									as="span"
									onClick={(event) => {
										event.stopPropagation();
									}}
								>
									@{parentPostAuthor.username}
								</Anchor>
							</Link>
						</Text>
					)}
					{parentPostAuthor === null && (
						<NotAvailableMessage
							margin={{ top: "xsmall" }}
							text="This reply's parent post author no longer exists."
						/>
					)}
					{isBlocked && (
						<NotAvailableMessage
							margin={{ top: "small" }}
							text="This content was blocked by a moderator."
						/>
					)}
					{(!isBlocked || author.username === username) && (
						<>
							<Text as="p" margin={{ top: "small" }}>
								{text}
							</Text>
							{media && (
								<Box direction="row" justify="center">
									<Image
										src={media}
										margin={{ top: "small" }}
										alt="Content image"
									/>
								</Box>
							)}
						</>
					)}
					<Box
						align="center"
						direction="row"
						margin={{ top: "small" }}
					>
						<Text
							as="p"
							color="dark-2"
							size="small"
							margin={{ right: "small" }}
						>
							{displayRelativeDateOrTime(createdAt)}
						</Text>
						{parentPostAuthor === undefined && !isBlocked && (
							<NewReplyModal
								iconSize="18px"
								postData={{ author, createdAt, id, text }}
								showButtonLabel={false}
							/>
						)}
						{author.username === username && (
							<DeleteContentModal
								iconSize="18px"
								id={id}
								isReply={parentPost !== undefined}
								parentPostId={parentPost && parentPost.id}
							/>
						)}
					</Box>
				</Box>
			</ListItem>
		</HoverBox>
	);
};

export default ContentListItem;
