import { ThemeType } from "grommet";

const secondary = "#32a852";

const theme: ThemeType = {
	select: {
		options: {
			container: {
				// background: "dark-1",
			},
		},
	},
	tab: {
		color: "red",
		hover: {
			color: "dark-3",
		},
		border: {
			hover: { color: "dark-3" },
			active: { color: secondary },
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
			paper: "#101010",
			brand: "#ac83fb",
			secondary: secondary,
			"status-error": {
				light: "#ff7e7e",
			},
			"status-ok": {
				dark: "#00faa2",
			},
			"dark-2": "#a2a2a2",
			"dark-3": "#d4d4d4",
		},
		focus: {
			outline: { color: secondary },
			border: { color: secondary },
		},
	},
};

export default theme;
