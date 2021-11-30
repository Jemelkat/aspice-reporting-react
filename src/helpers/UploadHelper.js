import axios from "axios";
import { getAuthHeaderToken } from "./AuthHelper";
const API_URL = "http://localhost:8080";

export const uploadSource = (file, onUploadProgress) => {
	let formData = new FormData();
	formData.append("file", file[0]);

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: getAuthHeaderToken(),
		},
	};
	return axios.post(API_URL + "/source/upload", formData, requestOptions);
};
