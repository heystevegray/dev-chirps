import {
	Box,
	Button,
	Form,
	FormField,
	ResponsiveContext,
	Select,
} from "grommet";
import { Search } from "grommet-icons";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useContext, useState } from "react";
import { SearchTypes } from "../../../graphql/types";
import AccentButton from "../../Buttons/AccentButton";

interface SearchOption {
	label: string;
	value: SearchTypes;
}

const SearchForm = () => {
	const sizeSmall = useContext(ResponsiveContext) === "small";
	const options: SearchOption[] = [
		{ label: "For Posts", value: "searchPosts" },
		{ label: "For Profiles", value: "searchProfiles" },
	];

	const history = useHistory();
	const location = useLocation();
	const queryStringValues = queryString.parse(location.search);

	const [text, setText] = useState(
		(queryStringValues && queryStringValues.text) || ""
	);

	const initialType =
		queryStringValues &&
		queryStringValues.type &&
		options.find((option) => option.value === queryStringValues.type);

	const [type, setType] = useState(initialType?.label || "");

	const getTypeFromLabel = (label: string): string | undefined => {
		const option = options.find(
			(searchOption: SearchOption) => searchOption.label === label
		);
		return option?.value;
	};

	return (
		<Form
			messages={{ required: "Required" }}
			onSubmit={(event: any) => {
				const {
					value: { searchText, searchLabel },
				} = event;
				const searchType = getTypeFromLabel(searchLabel);
				if (searchType) {
					history.push(
						`/search?type=${searchType}&text=${searchText}`
					);
				}
			}}
		>
			<Box
				align="start"
				margin={{ bottom: "large" }}
				direction="row-responsive"
				justify="between"
				gap="large"
			>
				<Box flex={{ grow: 1, shrink: 0 }}>
					<FormField
						a11yTitle="Search Text"
						id="searchText"
						name="searchText"
						onInput={(event: any) => {
							setText(event.target.value);
						}}
						placeholder="Search squeaken..."
						required
						value={text}
					/>
				</Box>
				<Box flex={{ grow: 1, shrink: 0 }}>
					<Box>
						<FormField
							a11yTitle="Type of Search"
							id="searchLabel"
							required
							name="searchLabel"
							placeholder="Type"
							control
							value={type}
							component={Select}
							options={options.map((option) => option.label)}
							plain
							onChange={(event: any) => {
								setType(event.target.value);
							}}
						/>
					</Box>
				</Box>
				{sizeSmall ? (
					<Box align="center">
						<Box alignContent="center" justify="center">
							<AccentButton
								tip="Search"
								a11yTitle="Search..."
								icon={<Search color="paper" size="22px" />}
								label="Search"
								type="submit"
							/>
						</Box>
					</Box>
				) : (
					<Box
						align="center"
						width="40px"
						height="40px"
						background="brand"
						justify="center"
						overflow="hidden"
						round="full"
					>
						<Button
							tip="Search"
							a11yTitle="Search..."
							icon={<Search color="paper" size="22px" />}
							type="submit"
						/>
					</Box>
				)}
			</Box>
		</Form>
	);
};

export default SearchForm;
