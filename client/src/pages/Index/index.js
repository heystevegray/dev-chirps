import { ChatOption } from "grommet-icons";
import MainLayout from "../../layouts/MainLayout";
import AccentButton from "../../components/AccentButton";
import { Box } from "grommet";
import { useAuth } from "../../context/AuthContext";

const Index = () => {
	const { login } = useAuth();
	return (
		<MainLayout centered>
			<Box align="center" margin={{ top: "small" }} width="100%">
				<ChatOption color="brand" size="300px" />
				<div>
					<AccentButton
						label="Login / Sign-up"
						margin={{ top: "medium" }}
						onClick={login}
					/>
				</div>
			</Box>
		</MainLayout>
	);
};

export default Index;
