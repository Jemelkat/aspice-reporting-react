export default class LocalStorageService {
	static getFromLS = (key) => {
		let ls = {};
		if (global.localStorage) {
			ls = global.localStorage.getItem(key);
		}
		return ls;
	};

	static saveToLS = (key, value) => {
		if (global.localStorage) {
			global.localStorage.setItem(key, value);
		}
	};
}