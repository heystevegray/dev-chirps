import { Box, Text, Anchor } from "grommet";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Content } from "../../graphql/types";
import { displayFullDatetime } from "../../lib/displayDatetime";
import Avatar from "../Avatar";
import NewReplyModal from "../Modals/NewReplyModal";
import NotAvailableMessage from "../NotAvailableMessage";

const SingleContent = ({ contentData }: { contentData: Content }) => {
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;
	const {
		author,
		id,
		createdAt,
		isBlocked,
		text,
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
				{isBlocked && (
					<NotAvailableMessage
						margin={{ bottom: "small", top: "xsmall" }}
						text="This content was blocked by a moderator."
					/>
				)}
				{(!isBlocked || author.username === username) && (
					<Box>
						<Text as="p" size="xlarge">
							{text}
						</Text>
					</Box>
				)}
			</Box>
			<Box align="center" direction="row" margin={{ top: "small" }}>
				<Text as="p" color="dark-3" size="small">
					{displayFullDatetime(createdAt)}
				</Text>
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
