import { Button, Form, FormField } from "grommet";
import { FormEventHandler, useState } from "react";
import CharacterCountLabel from "../CharacterCountLabel";
import RequiredLabel from "../RequiredLabel";

interface Props {
	accountId: string;
	updateViewer: React.Dispatch<React.SetStateAction<null>>;
}

const CreateProfileForm = ({ accountId, updateViewer }: Props) => {
	const [descCharCount, setDescCharCount] = useState(0);

	return (
		<Form
			messages={{ required: "This field is required 😬" }}
			onSubmit={(event) => {
				console.log("Submitted: ", event.value);
			}}
		>
			<FormField
				htmlFor="username"
				id="username"
				label={<RequiredLabel>Username</RequiredLabel>}
				name="username"
				required
				placeholder="Pick a unique username"
				validate={(fieldData) => {
					if (!/^[A-Za-z\d_]*$/.test(fieldData)) {
						return "Alphanumeric characters only (use underscores for whitespace)";
					}
				}}
			/>
			<FormField
				htmlFor="fullName"
				id="fullName"
				label="Full Name"
				name="fullName"
				placeholder="Add your full name"
			/>

			<FormField
				htmlFor="description"
				id="description"
				label={
					<CharacterCountLabel
						currentCharacters={descCharCount}
						label="Description"
						max={256}
					/>
				}
				name="description"
				placeholder="Write a short bio or description about yourself"
				onInput={(event: any) => {
					const characterCount = event.target.value.length;
					setDescCharCount(characterCount);
				}}
				validate={(fieldData) => {
					if (fieldData && fieldData.length > 256) {
						return "256 maximum character count exceeded";
					}
				}}
			/>

			<Button label="Create Profile" primary type="submit" />
		</Form>
	);
};

export default CreateProfileForm;
