import { Box, Image, Text, Anchor } from "grommet";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Content } from "../../../graphql/types";
import displayRelativeDateOrTime from "../../../lib/displayDatetime";
import Avatar from "../../Avatar";
import NotAvailableMessage from "../../NotAvailableMessage";

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
		<Box
			border={{
				color: "dark-2",
				size: "xsmall",
				style: "solid",
				side: "bottom",
			}}
			gap="small"
			direction="row"
			pad={{ left: "small", top: "medium", right: "small" }}
		>
			<Avatar fullName={author.fullName} avatar={author.avatar} />
			<Box flex margin={{ bottom: "medium" }}>
				<Text as="p">
					<Text weight="bold">{author.fullName}</Text>{" "}
					<Link to={`/profile/${author.username}`}>
						<Anchor color="brand" as="span">
							@{author.username}
						</Anchor>
					</Link>
				</Text>
				{parentPostAuthor && (
					<Text as="p">
						<Text color="dark-3">Replying to </Text>
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
		</Box>
	);
};

export default ContentListItem;
