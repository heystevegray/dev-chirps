import AccentButton from "../AccentButton";

const LoadMoreButton = (props: any) => (
	<AccentButton
		label="Load More"
		margin={{ top: "medium" }}
		primary
		{...props}
	/>
);

export default LoadMoreButton;
