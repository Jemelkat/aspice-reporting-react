import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Loader from "../../ui/Loader/Loader";
import ItemSettingsMenu from "../ComponentSettings/ItemSettingsMenu";
import TemplateMenu from "./TemplateMenu";
import { useAlert } from "react-alert";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";
import TemplateService from "../../services/TemplateService";

const TemplateCreate = ({ mode, templateId, addItem = null }) => {
	const [templateLoading, setTemplateLoading] = useState(true);
	const [isProcessing, setProcessing] = useState(false);
	const [templateData, setTemplateData] = useState({
		id: null,
		orientation: "VERTICAL",
		templateName: "",
	});
	const history = useHistory();
	const alert = useAlert();
	const {
		items,
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
		parseLoadedItems,
	} = useCanvas();

	//Saves template to DB
	const saveTemplateHandler = async (formValues) => {
		setProcessing(true);
		try {
			let template = {
				id: formValues.id,
				templateName: formValues.templateName,
				orientation: formValues.orientation,
				templateItems: items[0],
			};
			const response = await TemplateService.saveTemplate(template);
			parseLoadedItems(response.data.templateItems);
			setTemplateData({
				id: response.data.id,
				orientation: response.data.orientation,
				templateName: response.data.templateName,
			});
			setProcessing(false);
			alert.info("Template saved");
		} catch (e) {
			setProcessing(false);
			if (e.response?.data && e.response.data?.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error saving template.");
			}
		}
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
						if (loadedItems.templateItems.length > 0) {
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
					setTemplateData({
						id: templateId,
						orientation: loadedItems.orientation,
						templateName: loadedItems.templateName,
					});
					parseLoadedItems(loadedItems.templateItems);
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

	const orientationChangeHandler = (newOrientation) => {
		setTemplateData((prev) => {
			return { ...prev, orientation: newOrientation };
		});
		orientationHandler(newOrientation);
	};

	const templateNameHandler = (name) => {
		setTemplateData((prev) => {
			return { ...prev, templateName: name };
		});
	};

	return (
		<>
			{templateLoading && mode === "edit" ? (
				<div className='flex flex-col items-center justify-center h-screen-header'>
					<Loader>Loading template data...</Loader>
				</div>
			) : (
				<div className='flex bg-gray-200'>
					{/*Left sidebar*/}
					<TemplateMenu
						id={templateData.id}
						orientation={templateData.orientation}
						name={templateData.templateName}
						onSetName={templateNameHandler}
						onOrientationChange={orientationChangeHandler}
						onSave={saveTemplateHandler}
						onAddComponent={addItemHandler}
						isProcessing={isProcessing}
					></TemplateMenu>
					{/*Canvas*/}
					<Canvas
						items={items[0]}
						onMove={moveItemHandler}
						selectedItem={selectedItem}
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
