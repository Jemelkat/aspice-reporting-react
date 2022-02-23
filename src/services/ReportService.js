import axios from "axios";
import {getAuthHeaderToken} from "../helpers/AuthHelper";
import {axiosInstance} from "../helpers/AxiosHelper";

export default class ReportService {
	static saveReport = async (formValues, items) => {
		return axiosInstance.post("reports/save", {
			id: formValues.id,
			reportName: formValues.reportName,
			reportItems: items.map((i) => ({ ...i })),
			reportTemplate:
				formValues.templateId !== ""
					? {
						id: formValues.templateId,
					}
					: null,
		});
	};

	static getReport = async (reportId) => {
		return axiosInstance.get("/reports/get", { params: { reportId: reportId } });
	};

	static getAllSimple = async () => {
		return axiosInstance.get("/reports/allSimple");
	};

	static generateReport = async (reportId) => {
		return axios.get("http://localhost:8080/reports/generate", {
			headers: {
				Authorization: getAuthHeaderToken(),
				Accept: "application/pdf",
			},
			responseType: "blob",
			params: { reportId: reportId },
		});
	};
}
