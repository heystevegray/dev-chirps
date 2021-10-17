import { Anchor, Box, Text } from "grommet";
import { Book, Code } from "grommet-icons";
import ListItem from "../ListItem";
import { PinnedItem } from "../../../graphql/types";

interface PinnedItemProps {
	pinnedItemData: PinnedItem;
}

const PinnedItemListItem = ({ pinnedItemData }: PinnedItemProps) => {
	const { description, name, primaryLanguage, url } = pinnedItemData;
	const isRepo = primaryLanguage;

	return (
		<Box pad={{ left: "small", top: "medium", right: "small" }}>
			<ListItem
				icon={
					<Box
						align="center"
						background={primaryLanguage ? "brand" : "secondary"}
						height="48px"
						justify="center"
						overflow="hidden"
						round="full"
						width="48px"
					>
						{isRepo ? (
							<Book color="paper" />
						) : (
							<Code color="paper" />
						)}
					</Box>
				}
			>
				<Box gap="small">
					<Box direction="row" align="center">
						<Text as="p" margin={{ bottom: "small" }} weight="bold">
							<Anchor href={url}>{name}</Anchor>
						</Text>
					</Box>
					<Box flex>
						{description && (
							<Text as="p" margin={{ bottom: "xsmall" }}>
								{description}
							</Text>
						)}
					</Box>
					<Box flex margin={{ bottom: "medium" }}>
						{isRepo && (
							<Text as="p" color="dark-4">
								{primaryLanguage}
							</Text>
						)}
					</Box>
				</Box>
			</ListItem>
		</Box>
	);
};

export default PinnedItemListItem;
