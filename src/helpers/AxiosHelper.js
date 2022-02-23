import axios from "axios";
import {makeUseAxios} from "axios-hooks";
import {getAuthHeaderToken} from "./AuthHelper";

//All request should use this axios instance
export const axiosInstance = axios.create({
	baseURL: "http://localhost:8080",
});

//Use axios hook with this configuration
export const useAxios = makeUseAxios({
	axios: axiosInstance,
});

//Adds auhorization header to each axios request
const axiosAuthInterceptor = axiosInstance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: getAuthHeaderToken(),
		};

		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosAuthInterceptor;
