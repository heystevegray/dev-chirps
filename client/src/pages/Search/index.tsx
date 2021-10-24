import { useQuery } from "@apollo/client";
import { Box, Text } from "grommet";
import { Location } from "history";
import queryString from "query-string";
import LoadMoreButton from "../../components/Buttons/LoadMoreButton";
import EndOfList from "../../components/EndOfList";
import SearchForm from "../../components/Forms/SearchForm";
import GoHome from "../../components/Links/GoHome";
import ContentList from "../../components/Lists/ContentList";
import ProfileList from "../../components/Lists/ProfileList";
import Loader from "../../components/Loader";
import NotAvailableMessage from "../../components/NotAvailableMessage";
import { SEARCH_POSTS, SEARCH_PROFILES } from "../../graphql/queries";
import MainLayout from "../../layouts/MainLayout";
import { updateFieldPageResults } from "../../lib/updateQueries";

const Search = ({ location }: { location: Location }) => {
	const { text, type } = queryString.parse(location.search);
	const SEARCH_QUERY =
		type === "searchPosts" ? SEARCH_POSTS : SEARCH_PROFILES;

	const { data, fetchMore, loading, error } = useQuery(SEARCH_QUERY, {
		variables: {
			query: { text: text || "" },
		},
	});

	const validSearch =
		text && type && (type === "searchPosts" || type === "searchProfiles");
	const message = validSearch ? (
		<NotAvailableMessage
			text={`Sorry, no results for your search "${text}"`}
		/>
	) : (
		"Submit a search query above to see results."
	);

	if (error) {
		console.error(error);
		return (
			<MainLayout>
				<Box align="center" margin={{ top: "medium" }}>
					<Text as="p" color="status-error">
						Oof! Something went wrong with your search.
					</Text>
					<GoHome />
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

	const listView = data.searchPosts ? (
		<ContentList contentData={data[type]?.edges} />
	) : (
		<ProfileList profileData={data[type]?.edges} />
	);

	return (
		<MainLayout>
			<Box margin={{ top: "medium" }}>
				<SearchForm />
				{data && data[type] && data[type].edges.length ? (
					<>
						{listView}
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
