import { axiosInstance } from "../helpers/AxiosHelper";

export default class AuthService {
	static login = (username, password) => {
		return axiosInstance
			.post("/auth/signin", {
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

	static logout = () => {
		localStorage.removeItem("user");
	};

	static register = (username, email, password) => {
		return axiosInstance.post("/auth/signup", {
			username,
			email,
			password,
		});
	};

	static getAuthHeaderToken = () => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user && user.token) {
			return "Bearer " + user.token;
		} else {
			return {};
		}
	};

	static getLoggedUser = () => {
		return JSON.parse(localStorage.getItem("user"));
	};
}
