import {axiosInstance} from "../helpers/AxiosHelper";

export const saveTemplate = async (formValues, items) => {
	return axiosInstance.post("/templates/save", {
		id: formValues.id,
		templateName: formValues.templateName,
		templateItems: items.map((i) => ({ ...i })),
	});
};

class TemplateService {
	static getAllSimple = async () => {
		return axiosInstance.get("/templates/allSimple");
	};
}
export default TemplateService;
