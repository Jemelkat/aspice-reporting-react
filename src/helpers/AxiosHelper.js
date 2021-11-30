import axios from "axios";
import { getAuthHeaderToken } from "./AuthHelper";

const axiosAuthInterceptor = axios.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: getAuthHeaderToken(),
		};

		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosAuthInterceptor;
