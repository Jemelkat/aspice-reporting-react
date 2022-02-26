import { axiosInstance } from "../helpers/AxiosHelper";

export default class TemplateService {
	static getAllSimple = async () => {
		return axiosInstance.get("/templates/allSimple");
	};

	static saveTemplate = async (formValues, items) => {
		return axiosInstance.post("/templates/save", {
			id: formValues.id,
			templateName: formValues.templateName,
			orientation: formValues.orientation,
			templateItems: items.map((i) => ({ ...i })),
		});
	};

	static getTemplate = async (templateId) => {
		return axiosInstance.get("/templates/get", {
			params: { templateId: templateId },
		});
	};
}
