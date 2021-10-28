import { Anchor, Box, Text } from "grommet";

const Footer = () => {
	return (
		<footer>
			<Box
				background="dark-1"
				align="center"
				direction="row-responsive"
				justify="center"
				pad="xsmall"
				gap="xsmall"
				margin={{ top: "medium" }}
			>
				<Text as="p" textAlign="center">
					Built by{" "}
					<Anchor color="brand" href="https://heystevegray.dev/">
						Steve Gray
					</Anchor>
				</Text>
			</Box>
		</footer>
	);
};

export default Footer;
