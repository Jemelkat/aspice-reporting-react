import { axiosInstance } from "./AxiosHelper";

export const login = (username, password) => {
	return axiosInstance
		.post("/signin", {
			username,
			password,
		})
		.then((response) => {
			if (response.data.token) {
				localStorage.setItem("user", JSON.stringify(response.data));
			}
			return response.data;
		});
};

export const logout = () => {
	localStorage.removeItem("user");
};

export const register = (username, email, password) => {
	return axiosInstance.post("/signup", {
		username,
		email,
		password,
	});
};

export const getAuthHeaderToken = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	if (user && user.token) {
		return "Bearer " + user.token;
	} else {
		return {};
	}
};

export const getLoggedUser = () => {
	return JSON.parse(localStorage.getItem("user"));
};
