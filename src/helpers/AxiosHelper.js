import axios from "axios";
import { makeUseAxios } from "axios-hooks";
import AuthService from "../services/AuthService";

//All request should use this axios instance
export const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_API,
});

//Use axios hook with this configuration
export const useAxios = makeUseAxios({
	axios: axiosInstance,
});

//Adds auhorization header to each axios request
const axiosAuthInterceptor = axiosInstance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: AuthService.getAuthHeaderToken(),
		};

		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosAuthInterceptor;
