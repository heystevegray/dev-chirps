import { useQuery } from "@apollo/client";
import { Box, Text } from "grommet";
import LoadMoreButton from "../../components/Buttons/LoadMoreButton";
import EndOfList from "../../components/EndOfList";
import SearchForm from "../../components/Forms/SearchForm";
import ContentList from "../../components/Lists/ContentList";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { GET_POSTS } from "../../graphql/queries";
import MainLayout from "../../layouts/MainLayout";
import { updateFieldPageResults } from "../../lib/updateQueries";

const Home = () => {
	const value = useAuth();

	const { data, fetchMore, loading, error } = useQuery(GET_POSTS, {
		variables: {
			filter: {
				followedBy: value.viewerQuery.data.viewer.profile.username,
				includeBlocked: false,
			},
		},
	});

	if (error) {
		console.error(error);
		return (
			<MainLayout>
				<Box align="center" margin={{ top: "medium" }}>
					<Text as="p" color="status-error">
						Yikes! Something went wrong loading your feed.
					</Text>
				</Box>
			</MainLayout>
		);
	}

	if (loading) {
		return (
			<MainLayout>
				<Box align="center" margin={{ top: "medium" }}>
					<Loader />
				</Box>
			</MainLayout>
		);
	}

	const { posts } = data;

	return (
		<MainLayout>
			<Box margin={{ top: "medium" }}>
				<SearchForm />
			</Box>
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
												cursor: posts.pageInfo
													.endCursor,
											},
											updateQuery: (
												previousResult,
												{ fetchMoreResult }
											) =>
												updateFieldPageResults(
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
					<Text as="p">Nothing to display in your feed yet!</Text>
				)}
			</Box>
		</MainLayout>
	);
};

export default Home;
