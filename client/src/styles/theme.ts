import { ThemeType } from "grommet";

const theme: ThemeType = {
	tab: {
		color: "red",
		hover: {
			color: "dark-3",
		},
		border: {
			hover: { color: "dark-3" },
			active: { color: "#32a852" },
			color: "brand",
		},
	},
	global: {
		font: {
			family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
			size: "16px",
			height: "20px",
		},
		colors: {
			brand: "#ac83fb",
			secondary: "#32a852",
			"status-error": {
				light: "#ff4141",
			},
			"dark-3": "#bababa",
		},
		focus: {
			outline: { color: "#32a852" },
			border: { color: "#32a852" },
		},
	},
};

export default theme;
