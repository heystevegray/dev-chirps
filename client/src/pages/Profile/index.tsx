import { useQuery } from "@apollo/client";
import { Route } from "react-router";
import Loader from "../../components/Loader";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileTabs from "../../components/ProfileTabs";
import { useAuth } from "../../context/AuthContext";
import { GET_PROFILE } from "../../graphql/queries";
import { MatchUsername } from "../../graphql/types";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";

const Profile = ({ match }: MatchUsername) => {
	const { checkingSession, viewerQuery } = useAuth();
	let username;

	if (match.params.username) {
		username = match.params.username;
	} else if (viewerQuery.data && viewerQuery.data.viewer.profile) {
		username = viewerQuery.data.viewer.profile.username;
	}

	const { data, error, loading, refetch } = useQuery(GET_PROFILE, {
		skip: !username,
		variables: { username },
	});

	if (checkingSession || loading) {
		return (
			<MainLayout>
				<Loader centered />
			</MainLayout>
		);
	} else if (data && data.profile) {
		return (
			<MainLayout>
				<ProfileHeader
					profileData={data.profile}
					refetchProfile={refetch}
				/>
				<ProfileTabs username={username} />
			</MainLayout>
		);
	} else if (error) {
		return <Route component={NotFound} />;
	}

	return <MainLayout>{null}</MainLayout>;
};

export default Profile;
