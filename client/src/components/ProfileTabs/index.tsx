import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs, Text } from "grommet";
import { ChatOption, Group, Note, Pin } from "grommet-icons";
import { GET_PROFILE_CONTENT } from "../../graphql/queries";
import { updateSubfieldPageResults } from "../../lib/updateQueries";
import LoadMoreButton from "../Buttons/LoadMoreButton";
import EndOfList from "../EndOfList";
import ContentList from "../Lists/ContentList";
import ProfileList from "../Lists/ProfileList";
import PinnedItemList from "../Lists/PinnedItemList";
import Loader from "../Loader";
import RichTabTitle from "../RichTabTitle";

const ProfileTabs = ({ username }: { username: string }) => {
	const { data, loading, error, fetchMore } = useQuery(GET_PROFILE_CONTENT, {
		variables: {
			username,
		},
	});

	if (error) {
		console.error(error);
		return (
			<Box align="center" margin={{ top: "medium" }}>
				<Text as="p" color="status-error">
					Yikes! Something went wrong loading{" "}
					<Text as="span" color="dark-3">
						{username}'s
					</Text>{" "}
					Profile Content.
				</Text>
			</Box>
		);
	}

	if (loading || !data) {
		return (
			<Box align="center" margin={{ top: "medium" }}>
				<Loader />
			</Box>
		);
	}

	const {
		profile: { following, posts, replies, pinnedItems },
	} = data;

	return (
		<Tabs justify="center" margin={{ bottom: "medium", top: "medium" }}>
			<Tab
				title={
					<RichTabTitle icon={<Note />} label="Posts" size="xsmall" />
				}
			>
				<Box margin={{ top: "medium" }}>
					{posts.edges.length ? (
						<>
							<ContentList contentData={posts.edges} />
							{posts.pageInfo.hasNextPage && (
								<Box direction="row" justify="center">
									<LoadMoreButton
										onClick={() =>
											fetchMore({
												variables: {
													postsCursor:
														posts.pageInfo
															.endCursor,
												},
												updateQuery: (
													previousResult,
													{ fetchMoreResult }
												) =>
													updateSubfieldPageResults(
														"profile",
														"posts",
														fetchMoreResult,
														previousResult
													),
											})
										}
									/>
								</Box>
							)}
							{!posts.pageInfo.hasNextPage && <EndOfList />}
						</>
					) : (
						<Text as="p">No posts to display yet!</Text>
					)}
				</Box>
			</Tab>
			<Tab
				title={
					<RichTabTitle
						icon={<ChatOption />}
						label="Replies"
						size="xsmall"
					/>
				}
			>
				<Box margin={{ top: "medium" }}>
					{replies.edges.length ? (
						<>
							<ContentList contentData={replies.edges} />
							{replies.pageInfo.hasNextPage && (
								<Box direction="row" justify="center">
									<LoadMoreButton
										onClick={() =>
											fetchMore({
												variables: {
													repliesCursor:
														replies.pageInfo
															.endCursor,
												},
												updateQuery: (
													previousResult,
													{ fetchMoreResult }
												) =>
													updateSubfieldPageResults(
														"profile",
														"replies",
														fetchMoreResult,
														previousResult
													),
											})
										}
									/>
								</Box>
							)}
							{!replies.pageInfo.hasNextPage && <EndOfList />}
						</>
					) : (
						<Text as="p">No replies to display yet!</Text>
					)}
				</Box>
			</Tab>
			<Tab
				title={
					<RichTabTitle
						icon={<Group />}
						label="Following"
						size="xsmall"
					/>
				}
			>
				<Box margin={{ top: "medium" }}>
					{following.edges.length ? (
						<>
							<ProfileList profileData={following.edges} />
							{following.pageInfo.hasNextPage && (
								<Box direction="row" justify="center">
									<LoadMoreButton
										onClick={() =>
											fetchMore({
												variables: {
													followingCursor:
														following.pageInfo
															.endCursor,
												},
												updateQuery: (
													previousResult,
													{ fetchMoreResult }
												) =>
													updateSubfieldPageResults(
														"profile",
														"following",
														fetchMoreResult,
														previousResult
													),
											})
										}
									/>
								</Box>
							)}
							{!following.pageInfo.hasNextPage && <EndOfList />}
						</>
					) : (
						<Text as="p">No followed users to display yet!</Text>
					)}
				</Box>
			</Tab>

			<Tab
				title={
					<RichTabTitle icon={<Pin />} label="Code" size="xsmall" />
				}
			>
				<Box margin={{ top: "medium" }}>
					{pinnedItems && pinnedItems.length ? (
						<PinnedItemList pinnedItemsData={pinnedItems} />
					) : (
						<Text as="p">No code to display yet!</Text>
					)}
				</Box>
			</Tab>
		</Tabs>
	);
};

export default ProfileTabs;
