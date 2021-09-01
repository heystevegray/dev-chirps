import { useQuery } from "@apollo/client";
import { Box, Text } from "grommet";
import { Location } from "history";
import queryString from "query-string";
import LoadMoreButton from "../../components/Buttons/LoadMoreButton";
import EndOfList from "../../components/EndOfList";
import SearchForm from "../../components/Forms/SearchForm";
import ContentList from "../../components/Lists/ContentList";
import Loader from "../../components/Loader";
import NotAvailableMessage from "../../components/NotAvailableMessage";
import { SEARCH_POSTS } from "../../graphql/queries";
import MainLayout from "../../layouts/MainLayout";
import { updateFieldPageResults } from "../../lib/updateQueries";

const Search = ({ location }: { location: Location }) => {
	const SEARCH_QUERY = SEARCH_POSTS;
	const { text, type } = queryString.parse(location.search);
	const validSearch =
		text && type && (type === "searchPosts" || type === "searchProfiles");
	const message = validSearch ? (
		<NotAvailableMessage
			text={`Sorry, no results for your search "${text}"`}
		/>
	) : (
		"Submit a search query above to see results."
	);

	const { data, fetchMore, loading } = useQuery(SEARCH_QUERY, {
		variables: {
			query: { text: text || "" },
		},
	});

	console.log({ data });

	if (loading) {
		return (
			<MainLayout>
				<Box align="center" margin={{ top: "medium" }}>
					<Loader />
				</Box>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<Box margin={{ top: "medium" }}>
				<SearchForm />
				{data && data[type] && data[type].edges.length ? (
					<>
						<ContentList contentData={data[type].edges} />
						{data[type].pageInfo.hasNextPage && (
							<Box direction="row" justify="center">
								<LoadMoreButton
									onClick={() => {
										fetchMore({
											variables: {
												cursor: data[type].pageInfo
													.endCursor,
											},
											updateQuery: (
												previousResult,
												{ fetchMoreResult }
											) =>
												updateFieldPageResults(
													type,
													fetchMoreResult,
													previousResult
												),
										});
									}}
								/>
							</Box>
						)}
						{!data[type].pageInfo.hasNextPage && <EndOfList />}
					</>
				) : (
					<Box margin={{ top: "medium" }} align="center">
						<Text as="p" margin={{ top: "small" }}>
							{message}
						</Text>
					</Box>
				)}
			</Box>
		</MainLayout>
	);
};

export default Search;
