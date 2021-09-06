import { ApolloCache, InMemoryCache, useMutation } from "@apollo/client";
import { Box, Text } from "grommet";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from "../../../graphql/mutations";
import { Profile } from "../../../graphql/types";
import {
	updateProfileContentFollowing,
	updateSearchProfilesFollowing,
} from "../../../lib/updateQueries";
import AccentButton from "../../Buttons/AccentButton";
import HoverBox from "../../HoverBox";
import ListItem from "../ListItem";
import queryString from "query-string";
import UsernameHeader from "../../UsernameHeader";

const ProfileListItem = ({ profileData }: { profileData: Profile }) => {
	const { avatar, description, fullName, username, id, viewerIsFollowing } =
		profileData;
	const history = useHistory();
	const location = useLocation();
	const params = useParams<{ username: string }>();
	const value = useAuth();
	const { username: viewerUsername } = value.viewerQuery.data.viewer.profile;

	const update = (cache: ApolloCache<InMemoryCache>) => {
		if (params.username) {
			updateProfileContentFollowing(cache, id, params.username);
		} else if (location.pathname === "/search") {
			const { text } = queryString.parse(location.search);
			updateSearchProfilesFollowing(cache, id, text);
		}
	};

	const [followProfile, { loading }] = useMutation(FOLLOW_PROFILE, {
		update,
	});
	const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE, {
		update,
	});

	const variables = {
		data: {
			followingProfileId: id,
		},
		where: {
			username: viewerUsername,
		},
	};

	return (
		<HoverBox
			onClick={() => {
				history.push(`/profile/${username}`);
			}}
			pad={{ left: "small", top: "medium", right: "small" }}
		>
			<ListItem fullName={fullName} avatar={avatar}>
				<Box direction="row-responsive" width="100%">
					<Box width="100%">
						<Box
							flex={{ grow: 1, shrink: 0 }}
							margin={{ bottom: "medium" }}
						>
							<UsernameHeader
								fullName={fullName}
								username={username}
							/>
							<Text
								as="p"
								margin={{ bottom: "small", top: "small" }}
							>
								{description}
							</Text>
						</Box>
					</Box>
					<Box align="center" width="100%" justify="center">
						{viewerUsername !== username && (
							<Box
								alignSelf="end"
								margin="medium"
								onClick={(event) => {
									event.stopPropagation();
								}}
							>
								<AccentButton
									color={
										viewerIsFollowing
											? "brand"
											: "secondary"
									}
									disabled={loading}
									label={
										viewerIsFollowing
											? "Unfollow"
											: "Follow"
									}
									onClick={() => {
										if (viewerIsFollowing) {
											unfollowProfile({ variables });
										} else {
											followProfile({ variables });
										}
									}}
								/>
							</Box>
						)}
					</Box>
				</Box>
			</ListItem>
		</HoverBox>
	);
};

export default ProfileListItem;
