import { axiosInstance } from "../helpers/AxiosHelper";

export const saveDashboard = async (formValues, items) => {
	debugger;
	return axiosInstance.post("dashboard/save", {
		id: formValues.id,
		dashboardItems: items.map((i) => ({ ...i })),
	});
};

export const getDashboard = async () => {
	return axiosInstance.get("/dashboard");
};
