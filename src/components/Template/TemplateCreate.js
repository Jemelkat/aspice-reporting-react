import { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/AxiosHelper";
import { useHistory } from "react-router";
import Loader from "../../ui/Loader/Loader";
import ItemSettingsMenu from "../ComponentSettings/ItemSettingsMenu";
import TemplateMenu from "./TemplateMenu";
import { useAlert } from "react-alert";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";
import TemplateService from "../../services/TemplateService";
import { createItemFromExisting } from "../../helpers/ClassHelper";

const TemplateCreate = ({ mode, templateId, addItem = null }) => {
	const [templateData, setTemplateData] = useState(null);
	const [templateLoading, setTemplateLoading] = useState(true);
	const [isProcessing, setProcessing] = useState(false);

	const history = useHistory();
	const alert = useAlert();
	const {
		items,
		setItems,
		showSelected,
		selectedItem,
		moveItemHandler,
		resizeItemHandler,
		selectItemHandler,
		deleteItemHandler,
		addItemHandler,
		layerItemHandler,
		updateItemHandler,
		orientationHandler,
	} = useCanvas();

	//Saves template to DB
	const saveTemplateHandler = async (formValues) => {
		setProcessing(true);
		try {
			const response = await TemplateService.saveTemplate(
				formValues,
				items,
				mode
			);
			parseAndSetComponents(response.data.templateItems);
			setTemplateData(response.data);
			setProcessing(false);
			alert.info("Template saved");
		} catch (e) {
			setProcessing(false);
			if (e.response.data && e.response.data.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error saving template.");
			}
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
			TemplateService.getTemplate(templateId)
				.then((response) => {
					let loadedItems = response.data;
					//Add new item if template was redirected from dashboard
					if (addItem) {
						let addedItemId = 0;
						if (loadedItems.length > 0) {
							addedItemId =
								Math.max.apply(
									null,
									loadedItems.templateItems.map((item) => item.id)
								) + 1;
						}
						//Set new ID to added item as max + 1 or 0 if template is empty
						let updatedAddItem = addItem;
						updatedAddItem.id = addedItemId;
						loadedItems.templateItems.push(updatedAddItem);
					}
					setTemplateData(loadedItems);
					parseAndSetComponents(loadedItems.templateItems);
					setTemplateLoading(false);
					alert.info("Template loaded.");
				})
				.catch(() => {
					alert.error("Error getting template data.");
					history.push("/template");
				});
		} else {
			setTemplateLoading(false);
		}
	}, []);

	const orientationChangeHandler = (orientation) => {
		setTemplateData((prevState) => ({
			...prevState,
			orientation: orientation,
		}));
		orientationHandler(orientation);
	};

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
					<TemplateMenu
						data={templateData}
						onOrientationChange={orientationChangeHandler}
						onSave={saveTemplateHandler}
						onAddComponent={addItemHandler}
						isProcessing={isProcessing}
					></TemplateMenu>
					{/*Canvas*/}
					<Canvas
						items={items}
						onMove={moveItemHandler}
						orientation={templateData?.orientation}
						onSelect={selectItemHandler}
						onResize={resizeItemHandler}
						onDeleteItem={deleteItemHandler}
					></Canvas>
					{/*Right sidebar */}
					<ItemSettingsMenu
						show={showSelected}
						onClose={() => selectItemHandler(null)}
						selectedItem={selectedItem}
						onDeleteItem={deleteItemHandler}
						onLayerChange={layerItemHandler}
						onItemUpdate={updateItemHandler}
					></ItemSettingsMenu>
				</div>
			)}
		</>
	);
};

export default TemplateCreate;
