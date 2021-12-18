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
import TemplateCanvasRight from "../Template/TemplateCanvasRight";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import TemplateCanvasLeft from "./TemplateCanvasLeft";
import { useAlert } from "react-alert";

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

const TemplateCreate = (props) => {
	//Stores all components currently on canvas
	const [components, setComponents] = useState([]);
	const [showSelected, setShowSelected] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState(null);

	const history = useHistory();
	const alert = useAlert();

	const [{ data, loading, error }, fetchData] = useAxios(
		{
			url: "/template/get",
			method: "GET",
			params: { templateId: props.templateId },
		},
		{ useCache: false, manual: true }
	);

	//Get next id for new component
	const nextItemId = () => {
		const itemArray = components;
		if (itemArray.length === 0) {
			return 0;
		} else {
			return (
				Math.max.apply(
					null,
					itemArray.map((item) => item.itemId)
				) + 1
			);
		}
	};

	//Add new component to canvas
	const addComponentHandler = (type) => {
		let item;
		switch (type) {
			case typeEnum.TEXT:
				item = new Item(nextItemId(), 0, 0, 150, 50, typeEnum.STATIC_TEXT);
				break;
			case typeEnum.GRAPH:
				item = new Item(nextItemId(), 0, 0, 200, 200, typeEnum.GRAPH);
				break;
			case typeEnum.TABLE:
				item = new Item(nextItemId(), 0, 0, 350, 200, typeEnum.TABLE);
				break;
			default:
				break;
		}
		setComponents([...components, item]);
	};

	//Saves template to DB
	const saveTemplateHandler = (formValues) => {
		axiosInstance
			.post("/template/save", {
				templateId: formValues.id,
				templateName: formValues.templateName,
				templateItems:
					//TODO REMOVE LINE AFTER : - new items are created every time
					props.mode === "create"
						? components.map((e) => ({ ...e, itemId: null }))
						: components.map((e) => ({ ...e, itemId: null })),
			})
			.then(function (response) {
				history.push("/template");
			})
			.catch(function (error) {
				//TODO ADD ALERT
				console.log(error);
			});
	};

	//Change state list item x, y on each item move
	const moveItemHandler = (id, x, y) => {
		let updatedComponents = components.map((i) =>
			i.itemId === id ? { ...i, x: x, y: y } : i
		);
		setSelectedComponent(updatedComponents.find((i) => i.itemId === id));
		setShowSelected(true);
		setComponents(updatedComponents);
	};

	//Change height, width state of item on resize
	const resizeItemHandler = (id, x, y, height, width) => {
		let updatedComponents = components.map((i) => {
			return i.itemId === id
				? { ...i, x: x, y: y, height: height, width: width }
				: i;
		});
		setSelectedComponent(updatedComponents.find((i) => i.itemId === id));
		setShowSelected(true);
		setComponents(updatedComponents);
	};

	const selectComponentHandler = (id) => {
		setSelectedComponent(components.find((i) => i.itemId === id));
		setShowSelected(true);
	};

	const deleteItemHandler = (id) => {
		setShowSelected(false);
		setSelectedComponent(null);
		setComponents(components.filter((c) => c.itemId !== id));
	};

	const layerItemHandler = (id, to) => {
		const nextFirst = components.filter((component) => component.itemId === id);
		const nextComponents = components.filter(
			(component) => component.itemId !== id
		);

		//Check if item exists
		if (nextFirst.length !== 1) {
			alert.error("Canvas error - found multiple items with id " + id);
			return;
		}

		if (to === "top") {
			setComponents([...nextComponents, nextFirst[0]]);
		}

		if (to === "bottom") {
			setComponents([nextFirst[0], ...nextComponents]);
		}
	};

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		if (components) {
			newComponents = components.map(
				(i) => new Item(i.itemId, i.x, i.y, i.width, i.height, i.type)
			);
		}
		setComponents(newComponents);
	};

	useEffect(() => {
		if (props.mode === "edit")
			fetchData().then((response) => {
				parseAndSetComponents(response.data.templateItems);
			});
	}, []);

	return (
		<>
			{loading && props.mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex items-center justify-center flex-grow'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex'>
					{/*Left sidebar */}
					<TemplateCanvasLeft
						data={data}
						onSave={saveTemplateHandler}
						onAddComponent={addComponentHandler}
					></TemplateCanvasLeft>
					{/*Canvas*/}
					<div className='mt-10 mb-10 overflow-x-auto overflow-y-hidden border-2'>
						<div
							className='relative'
							style={{ width: "210mm", height: "297mm" }}
							onClick={() => {
								setShowSelected(false);
								setSelectedComponent(null);
							}}
						>
							{/*Generate stored components to canvas */}
							{components.map((i) => {
								return (
									<RndCanvasItem
										key={i.itemId}
										item={i}
										onMove={moveItemHandler}
										onResize={resizeItemHandler}
										onSelect={selectComponentHandler}
									></RndCanvasItem>
								);
							})}
						</div>
					</div>
					{/*Right sidebar */}
					<TemplateCanvasRight
						show={showSelected}
						selectedComponent={selectedComponent}
						onDeleteItem={deleteItemHandler}
						onLayerChange={layerItemHandler}
					></TemplateCanvasRight>
				</div>
			)}
		</>
	);
};

export default TemplateCreate;
