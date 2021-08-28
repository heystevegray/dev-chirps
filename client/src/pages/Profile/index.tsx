import { useQuery } from "@apollo/client";
import { match as MatchInterface, Route } from "react-router";
import Loader from "../../components/Loader";
import { GET_PROFILE } from "../../graphql/queryies";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";

interface Props {
	match: MatchInterface<{ username?: string }>;
}

const Profile = ({ match }: Props) => {
	const { data, error, loading } = useQuery(GET_PROFILE, {
		variables: { username: match.params.username },
	});

	const username = match.params.username;
	const name = data?.profile?.fullName || username;

	if (loading) {
		return (
			<MainLayout>
				<Loader centered />
			</MainLayout>
		);
	} else if (data && data.profile) {
		return (
			<MainLayout>
				<p>My name is {name}</p>
			</MainLayout>
		);
	} else if (error) {
		return <Route component={NotFound} />;
	}

	return <MainLayout>{null}</MainLayout>;
};

export default Profile;
