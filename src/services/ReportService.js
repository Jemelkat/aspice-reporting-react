import axios from "axios";
import { axiosInstance } from "../helpers/AxiosHelper";
import AuthService from "./AuthService";

export default class ReportService {
	static saveReport = async (report) => {
		return axiosInstance.post("reports/save", {
			...report,
		});
	};

	static getReport = async (reportId) => {
		return axiosInstance.get("/reports/get", {
			params: { reportId: reportId },
		});
	};

	static getAllSimple = async () => {
		return axiosInstance.get("/reports/allSimple");
	};

	static generateReport = async (reportId) => {
		return axios.get(process.env.REACT_APP_SERVER_API + "/reports/generate", {
			headers: {
				Authorization: AuthService.getAuthHeaderToken(),
				//Accept: "application/pdf",
			},
			responseType: "blob",
			params: { reportId: reportId },
		});
	};
}
