import { Box, Text, Anchor } from "grommet";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Content } from "../../../graphql/types";
import displayRelativeDateOrTime from "../../../lib/displayDatetime";
import NotAvailableMessage from "../../NotAvailableMessage";
import UsernameHeader from "../../UsernameHeader";
import ListItem from "../ListItem";

const ContentListItem = ({ contentData }: { contentData: Content }) => {
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;

	const {
		author,
		createdAt,
		isBlocked,
		postAuthor: parentPostAuthor,
		text,
	} = contentData;

	return (
		<ListItem fullName={author.fullName} avatar={author.avatar}>
			<Box flex margin={{ bottom: "medium" }}>
				<UsernameHeader
					fullName={author.fullName}
					username={author.username}
				/>
				{parentPostAuthor && (
					<Text as="p">
						<Text color="dark-1">Replying to </Text>
						<Link to={`/profile/${parentPostAuthor.username}`}>
							<Anchor as="span">
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
					<Text as="p" margin={{ top: "small" }}>
						{text}
					</Text>
				)}
				<Box align="center" direction="row" margin={{ top: "small" }}>
					<Text as="p" color="dark-3" size="small">
						{displayRelativeDateOrTime(createdAt)}
					</Text>
				</Box>
			</Box>
		</ListItem>
	);
};

export default ContentListItem;
