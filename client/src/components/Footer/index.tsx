import { Anchor, Box, Text } from "grommet";

const Footer = () => (
	<footer>
		<Box
			background="dark-1"
			align="center"
			direction="row-responsive"
			justify="center"
			pad="small"
			gap="xsmall"
			margin={{ top: "medium" }}
		>
			<Text as="p" textAlign="center">
				Built by{" "}
				<Anchor color="brand" href="https://heystevegray.dev/">
					Steve Gray
				</Anchor>
			</Text>
			<Text
				as="p"
				textAlign="center"
			>{`All rights reserved ${new Date().getFullYear()}`}</Text>
		</Box>
	</footer>
);

export default Footer;
