import { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/AxiosHelper";
import { useHistory } from "react-router";
import Loader from "../UI/Loader/Loader";
import CanvasRightMenu from "../Canvas/CanvasRightMenu";
import TemplateMenuLeft from "./TemplateMenuLeft";
import { useAlert } from "react-alert";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";
import { saveTemplate } from "../../services/TemplateService";
import { createItemFromExisting, Item } from "../../helpers/ClassHelper";

const TemplateCreate = ({ mode, templateId, addItem = null }) => {
	const [templateData, setTemplateData] = useState(null);
	const [templateLoading, setTemplateLoading] = useState(true);
	const history = useHistory();
	const alert = useAlert();
	const {
		items,
		setItems,
		showSelected,
		hideSettings,
		selectedItem,
		moveItemHandler,
		resizeItemHandler,
		selectItemHandler,
		deleteItemHandler,
		addItemHandler,
		layerItemHandler,
		updateItemHandler,
	} = useCanvas();

	//Saves template to DB
	const saveTemplateHandler = async (formValues) => {
		try {
			const response = await saveTemplate(formValues, items, mode);
			parseAndSetComponents(response.data.templateItems);
			alert.info("Template saved");
			history.push("/template");
		} catch (e) {
			alert.error("Error saving template.");
		}
	};

	//Parses components of template to Item array
	const parseAndSetComponents = (components) => {
		let newComponents = [];
		if (components) {
			newComponents = components.map((i) => createItemFromExisting(i));
		}
		setItems(newComponents);
	};

	useEffect(() => {
		//EDIT - load template for reseting
		if (mode === "edit") {
			setTemplateLoading(true);
			axiosInstance
				.get("/templates/get", { params: { templateId: templateId } })
				.then((response) => {
					let loadedItems = response.data;
					//Add new item if template was redirected from dashboard
					if (addItem) {
						const addedItemId =
							Math.max.apply(
								null,
								loadedItems.reportItems.map((item) => item.id)
							) + 1;
						let updatedAddItem = addItem;
						updatedAddItem.id = addedItemId;
						loadedItems.reportItems.push(updatedAddItem);
					}
					setTemplateData(loadedItems);
					parseAndSetComponents(loadedItems.templateItems);
					setTemplateLoading(false);
					alert.info("Template loaded.");
				})
				.catch(() => {
					alert.error("Error getting template date.");
					history.push("/report");
				});
		} else {
			setTemplateLoading(false);
		}
	}, []);

	return (
		<>
			{templateLoading && mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex flex-col items-center justify-center h-screen-header'>
					<Loader>Loading template data...</Loader>
				</div>
			) : (
				<div className='flex bg-gray-200'>
					{/*Left sidebar*/}
					<TemplateMenuLeft
						data={templateData}
						onSave={saveTemplateHandler}
						onAddComponent={addItemHandler}
					></TemplateMenuLeft>
					{/*Canvas*/}
					<Canvas
						items={items}
						onMove={moveItemHandler}
						onSelect={selectItemHandler}
						onResize={resizeItemHandler}
						onDeleteItem={deleteItemHandler}
					></Canvas>
					{/*Right sidebar */}
					<CanvasRightMenu
						show={showSelected}
						onClose={hideSettings}
						selectedItem={selectedItem}
						onDeleteItem={deleteItemHandler}
						onLayerChange={layerItemHandler}
						onItemUpdate={updateItemHandler}
					></CanvasRightMenu>
				</div>
			)}
		</>
	);
};

export default TemplateCreate;
