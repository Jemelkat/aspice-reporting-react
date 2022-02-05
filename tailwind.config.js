module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	important: true,
	theme: {
		extend: {
			width: {
				"36r": "30rem",
			},
			height: {
				"screen-header": "calc(100vh - 4rem)",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
