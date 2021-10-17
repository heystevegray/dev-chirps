import { useQuery } from "@apollo/client";
import { Box } from "grommet";
import { Route } from "react-router";
import LoadMoreButton from "../../components/Buttons/LoadMoreButton";
import EndOfList from "../../components/EndOfList";
import ContentList from "../../components/Lists/ContentList";
import Loader from "../../components/Loader";
import SingleContent from "../../components/SingleContent";
import { GET_POST } from "../../graphql/queries";
import { MatchId } from "../../graphql/types";
import MainLayout from "../../layouts/MainLayout";
import { updateSubfieldPageResults } from "../../lib/updateQueries";
import NotFound from "../NotFound";

export const loadingComponent = (
	<MainLayout>
		<Box align="center" margin={{ top: "medium" }}>
			<Loader />
		</Box>
	</MainLayout>
);

const Post = ({ match }: MatchId) => {
	const { data, fetchMore, loading, error } = useQuery(GET_POST, {
		variables: {
			id: match.params.id,
		},
	});

	if (loading) {
		return loadingComponent;
	} else if (data && data.post) {
		const { post } = data;
		return (
			<MainLayout>
				<SingleContent contentData={post} />
				<ContentList contentData={post.replies.edges} />
				{post.replies.pageInfo.hasNextPage && (
					<Box direction="row" justify="center">
						<LoadMoreButton
							onClick={() =>
								fetchMore({
									variables: {
										repliesCursor:
											post.replies.pageInfo.endCursor,
									},
									updateQuery: (
										previousResult,
										{ fetchMoreResult }
									) =>
										updateSubfieldPageResults(
											"post",
											"replies",
											fetchMoreResult,
											previousResult
										),
								})
							}
						/>
					</Box>
				)}
				{post.replies.edges.length === 0 && (
					<EndOfList text="No replies yet" />
				)}
				{post.replies.edges.length > 0 &&
					!post.replies.pageInfo.hasNextPage && (
						<EndOfList text="End of replies" />
					)}
			</MainLayout>
		);
	} else if (error || !data || !data.post) {
		return <Route component={NotFound} />;
	}

	return loadingComponent;
};

export default Post;
