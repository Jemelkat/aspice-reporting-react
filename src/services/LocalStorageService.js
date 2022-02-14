export const getFromLS = (key) => {
	let ls = {};
	if (global.localStorage) {
		ls = global.localStorage.getItem(key);
	}
	return ls;
};

export const saveToLS = (key, value) => {
	if (global.localStorage) {
		global.localStorage.setItem(key, value);
	}
};
