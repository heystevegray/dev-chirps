import { Anchor, Box, Heading } from "grommet";

const NavBar = () => (
	<header>
		<Box
			align="center"
			border={{
				color: "dark-2",
				size: "xsmall",
				style: "solid",
				side: "bottom",
			}}
			direction="row"
			justify="between"
			pad="small"
		>
			<Heading color="brand" level="1" size="32px">
				<Anchor href="/" label="devchirps" />
			</Heading>
		</Box>
	</header>
);

export default NavBar;
