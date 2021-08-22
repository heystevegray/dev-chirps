import { ChatOption } from "grommet-icons";
import MainLayout from "../../layouts/MainLayout";
import AccentButton from "../../components/AccentButton";
import { Box } from "grommet";

const Index = () => {
	return (
		<MainLayout centered>
			<Box align="center" margin={{ top: "small" }} width="100%">
				<ChatOption color="brand" size="300px" />
				<div>
					<AccentButton
						label="Login / Sign-up"
						margin={{ top: "medium" }}
						onClick={() => console.log("clicked!")}
					/>
				</div>
			</Box>
		</MainLayout>
	);
};

export default Index;
