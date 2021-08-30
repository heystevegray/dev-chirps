import { useQuery } from "@apollo/client";
import { Box } from "grommet";
import { Route } from "react-router";
import ContentListItem from "../../components/ListItems/ContentListItem";
import Loader from "../../components/Loader";
import NotAvailableMessage from "../../components/NotAvailableMessage";
import SingleContent from "../../components/SingleContent";
import { GET_REPLY } from "../../graphql/queries";
import { MatchId } from "../../graphql/types";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";

const Reply = ({ match }: MatchId) => {
	const { data, loading } = useQuery(GET_REPLY, {
		variables: {
			id: match.params.id,
		},
	});

	if (loading) {
		return (
			<MainLayout>
				<Box align="center" margin={{ top: "medium" }}>
					<Loader />
				</Box>
			</MainLayout>
		);
	} else if (data && data.reply) {
		const { reply } = data;
		return (
			<MainLayout>
				{reply.post ? (
					<ContentListItem contentData={reply.post} />
				) : (
					<NotAvailableMessage
						margin="small"
						text="Oops. This reply's parent post no longer exists."
					/>
				)}
				<SingleContent contentData={reply} />
			</MainLayout>
		);
	}

	return <Route component={NotFound} />;
};

export default Reply;
