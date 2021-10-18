import { Box } from "grommet";
import { PinnedItem } from "../../../graphql/types";
import PinnedItemListItem from "../../ListItems/PinnedItemListItem";

export interface PinnedItemListProps {
	pinnedItemsData: PinnedItem[];
}

const PinnedItemList = ({ pinnedItemsData }: PinnedItemListProps) => (
	<Box>
		{pinnedItemsData.map((pinnedItem) => (
			<PinnedItemListItem
				pinnedItemData={pinnedItem}
				key={pinnedItem.id}
			/>
		))}
	</Box>
);

export default PinnedItemList;
