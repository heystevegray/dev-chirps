import { Box, Heading, Text } from "grommet";
import React from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

const NotFound = () => (
	<MainLayout centered>
		<Box align="center" justify="center" gap="medium">
			<Heading level="1">Oof.</Heading>
			<Heading level="2">Page not found.</Heading>
			<Text as="p">
				<span role="img" aria-label="waving hand">
					👋
				</span>{" "}
				This is not the page you are looking for.
			</Text>
			<Link to="/">
				<Text as="p" color="brand">
					Go Home
				</Text>
			</Link>
		</Box>
	</MainLayout>
);

export default NotFound;
