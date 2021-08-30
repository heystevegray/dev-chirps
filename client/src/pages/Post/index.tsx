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

const Post = ({ match }: MatchId) => {
	const { data, fetchMore, loading } = useQuery(GET_POST, {
		variables: {
			id: match.params.id,
		},
	});

	if (loading) {
		<MainLayout>
			<Box align="center" margin={{ top: "medium" }}>
				<Loader />
			</Box>
		</MainLayout>;
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
				{!post.replies.pageInfo.hasNextPage && <EndOfList />}
			</MainLayout>
		);
	}

	return <Route component={NotFound} />;
};

export default Post;
