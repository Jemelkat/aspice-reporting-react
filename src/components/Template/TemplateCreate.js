import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import { useEffect, useState } from "react";
import RndCanvasItem from "../UI/Canvas/RndCanvasItem";
import Button from "../UI/Button";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import { axiosInstance, useAxios } from "../../helpers/AxiosHelper";
import { useHistory } from "react-router";
import Loader from "../UI/Loader/Loader";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import CanvasRightMenu from "../Canvas/CanvasRightMenu";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import TemplateMenuLeft from "./TemplateMenuLeft";
import { useAlert } from "react-alert";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";

export const typeEnum = Object.freeze({
	GRAPH: "GRAPH",
	STATIC_TEXT: "STATIC_TEXT",
	TABLE: "TABLE",
});

class Item {
	constructor(id, x, y, width, height, type) {
		this.itemId = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
	}
}

const TemplateCreate = ({ mode, templateId }) => {
	const [templateData, setTemplateData] = useState(null);
	const [templateLoading, setTemplateLoading] = useState(true);
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
	} = useCanvas();

	//Saves template to DB
	const saveTemplateHandler = (formValues) => {
		axiosInstance
			.post("/template/save", {
				templateId: formValues.id,
				templateName: formValues.templateName,
				templateItems:
					//TODO REMOVE LINE AFTER : - new items are created every time
					mode === "create"
						? items.map((e) => ({ ...e, itemId: null }))
						: items.map((e) => ({ ...e, itemId: null })),
			})
			.then(function (response) {
				parseAndSetComponents(response.data.templateItems);
				alert.info("Template saved");
			})
			.catch(function (error) {
				alert.error("Error saving template.");
			});
	};

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		if (components) {
			newComponents = components.map(
				(i) => new Item(i.itemId, i.x, i.y, i.width, i.height, i.type)
			);
		}
		setItems(newComponents);
	};

	useEffect(() => {
		if (mode === "edit") {
			setTemplateLoading(true);
			axiosInstance
				.get("/template/get", { params: { templateId: templateId } })
				.then((response) => {
					setTemplateData(response.data);
					parseAndSetComponents(response.data.templateItems);
					setTemplateLoading(false);
					alert.info("Template loaded.");
				})
				.catch((error) => {
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
				<div className='flex items-center justify-center flex-grow'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex overflow-x-hidden'>
					{/*Left sidebar */}
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
						selectedItem={selectedItem}
						onDeleteItem={deleteItemHandler}
						onLayerChange={layerItemHandler}
					></CanvasRightMenu>
				</div>
			)}
		</>
	);
};

export default TemplateCreate;
