//Helper functions for loggin process
import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

export const login = (username, password) => {
	return axios
		.post(API_URL + "signin", {
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
	return axios.post(API_URL + "signup", {
		username,
		email,
		password,
	});
};

export const getAuthHeaderToken = () => {
	const user = JSON.parse(localStorage.getItem("user"));

	if (user && user.accessToken) {
		return { Authorization: "Bearer " + user.accessToken };
	} else {
		return {};
	}
};

export const getLoggedUser = () => {
	return JSON.parse(localStorage.getItem("user"));
};
