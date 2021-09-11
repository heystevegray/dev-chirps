import { ThemeType } from "grommet";

const secondary = "#006481";
const ok = "#00faa2";
const error = "#ff7e7e";

const theme: ThemeType = {
	select: {
		options: {
			container: {
				// background: "dark-1",
				// hoverIndicator: {
				// 	opacity: 1,
				// 	dark: "red",
				// 	elevation: "small",
				// 	background: 'red',
				// 	color: 'orange',
				// 	light: "blue"
				// },
				// color: '#fff'
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
	button: {
		color: "#000",
	},
	tip: {
		content: {
			background: "dark-1",
			elevation: "none",
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
			brand: "#00a7d8",
			"status-error": {
				light: error,
				dark: error,
			},
			"status-critical": {
				light: error,
				dark: error,
			},
			"status-ok": {
				light: ok,
				dark: ok,
			},
			"dark-1": "#202020",
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
