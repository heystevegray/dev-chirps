import { Box, Text } from "grommet";

const Footer = () => (
	<footer>
		<Box
			direction="row"
			justify="center"
			margin={{ top: "medium", bottom: "small" }}
		>
			<Text as="p">
				Made by and for devs{" "}
				<span role="img" aria-label="Developer emoji">
					👩🏻‍💻
				</span>
			</Text>
		</Box>
	</footer>
);

export default Footer;
