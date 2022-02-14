import { axiosInstance } from "../helpers/AxiosHelper";
import { typeEnum } from "../helpers/ClassHelper";

export const saveDashboard = async (dashboardId, items) => {
	let saveItems = items.map((i) => {
		switch (i.type) {
			case typeEnum.LEVEL_PIE_GRAPH:
			case typeEnum.CAPABILITY_BAR_GRAPH:
				i.source = i.source.id ? i.source : null;
				i.processColumn = i.processColumn.id ? i.processColumn : null;
				i.levelColumn = i.levelColumn.id ? i.levelColumn : null;
				i.attributeColumn = i.attributeColumn.id ? i.attributeColumn : null;
				i.scoreColumn = i.scoreColumn.id ? i.scoreColumn : null;
				break;
		}
		return i;
	});
	return axiosInstance.post("dashboard/save", {
		id: dashboardId,
		dashboardItems: saveItems.map((i) => ({ ...i })),
	});
};

export const getDashboard = async () => {
	return axiosInstance.get("/dashboard");
};

export const getItemData = async (id) => {
	return axiosInstance.get("/dashboard/data", { params: { itemId: id } });
};
