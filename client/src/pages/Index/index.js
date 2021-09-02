import { ChatOption } from "grommet-icons";
import MainLayout from "../../layouts/MainLayout";
import { Box } from "grommet";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import { Redirect } from "react-router";
import AccentButton from "../../components/Buttons/AccentButton";

const Index = () => {
	const { checkingSession, isAuthenticated, login, viewerQuery } = useAuth();
	let viewer;

	if (viewerQuery && viewerQuery.data) {
		viewer = viewerQuery.data.viewer;
	}

	if (checkingSession) {
		return <Loader centered />;
	} else if (isAuthenticated && viewer) {
		return <Redirect to="/home" />;
	}

	return (
		<MainLayout centered>
			<Box align="center" margin={{ top: "small" }} width="100%">
				<ChatOption color="brand" size="300px" />
				<Box margin="xlarge">
					<AccentButton
						label="Login / Sign-up"
						margin={{ top: "medium" }}
						onClick={login}
					/>
				</Box>
			</Box>
		</MainLayout>
	);
};

export default Index;
