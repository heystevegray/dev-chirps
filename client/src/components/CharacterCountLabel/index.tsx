import { Text } from "grommet";

interface Props {
	currentCharacters: number;
	label: string;
	max: number;
}

const CharacterCountLabel = ({ currentCharacters = 0, label, max }: Props) => {
	return (
		<Text color={currentCharacters > max ? "status-critical" : undefined}>
			{`${label} (${currentCharacters}/${max} characters)`}
		</Text>
	);
};

export default CharacterCountLabel;
