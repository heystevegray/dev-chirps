import { Box } from "grommet";
import { ContentNode } from "../../../graphql/types";
import ContentListItem from "../../ListItems/ContentListItem";

export interface ContentProps {
	contentData: ContentNode[];
}

const ContentList = ({ contentData }: ContentProps) => {
	return (
		<Box>
			{contentData.map((itemContentData: ContentNode) => (
				<ContentListItem
					contentData={itemContentData.node}
					key={itemContentData.node.id}
				/>
			))}
		</Box>
	);
};

export default ContentList;
