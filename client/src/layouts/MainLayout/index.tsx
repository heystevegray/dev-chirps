import { Box } from "grommet";
import { ReactElement } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";

interface Props {
	centered?: boolean;
	children: ReactElement | ReactElement[] | null;
}

const MainLayout = ({ centered, children }: Props) => (
	<Box
		direction="column"
		justify="between"
		style={{ minHeight: "100vh" }}
		width="100%"
	>
		<NavBar />
		<Box
			align={centered ? "center" : "start"}
			flex={{ grow: 1, shrink: 0 }}
			justify={centered ? "center" : "start"}
			margin="medium"
		>
			<Container children={children} />
		</Box>
		<Footer />
	</Box>
);

export default MainLayout;
