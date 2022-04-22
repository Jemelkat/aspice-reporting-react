module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
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
	plugins: [],
};
