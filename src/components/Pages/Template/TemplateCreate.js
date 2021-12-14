import Sidebar from "../../UI/Sidebar/Sidebar";
import SidebarLinks from "../../UI/Sidebar/SidebarLinks";
import { useEffect, useState } from "react";
import RndCanvasItem from "../../UI/CanvasItem/RndCanvasItem";
import Button from "../../UI/Button";
import * as Yup from "yup";
import { Form, Formik, setNestedObjectValues } from "formik";
import FormHidden from "../../UI/Form/FormHidden";
import FormInput from "../../UI/Form/FormInput";
import { axiosInstance, useAxios } from "../../../helpers/AxiosHelper";
import { useHistory } from "react-router";
import Loader from "../../UI/Loader/Loader";

const typeEnum = Object.freeze({
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
	const [selectedComponent, setSelectedComponent] = useState(null);
	const history = useHistory();
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
		Object.assign(
			components.find((item) => item.itemId === id),
			{ x: x, y: y }
		);
	};

	const selectComponentHandler = (id) => {
		debugger;
		setSelectedComponent(id);
	};

	useEffect(() => {
		if (props.mode === "edit") fetchData();
	}, []);

	useEffect(() => {
		if (data) {
			const newComponents = data.templateItems.map(
				(i) => new Item(i.itemId, i.x, i.y, i.width, i.height, i.type)
			);
			setComponents(newComponents);
		}
	}, [data]);

	return (
		<>
			{loading && props.mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex flex-grow justify-center items-center'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex'>
					{/*Left sidebar */}
					<div className='flex-1 mr-2 xl:mr-4'>
						<div className='flex justify-start h-screen sticky top-0'>
							<Sidebar className='bg-gray-300 overflow-y-auto'>
								<SidebarLinks sidebarName='Report'>
									<Formik
										initialValues={{
											id: data ? data.templateId : null,
											templateName: data ? data.templateName : "",
										}}
										validationSchema={Yup.object({
											templateName: Yup.string().required("Required"),
										})}
										onSubmit={(values, { setSubmitting }) => {
											saveTemplateHandler(values);
											setSubmitting(false);
										}}
									>
										{({ handleChange, values }) => (
											<Form className='flex flex-col p-4'>
												<FormHidden name='id'></FormHidden>
												<FormInput
													label='Template name'
													name='templateName'
													type='text'
													placeholder='Template name...'
												/>
												<Button type='submit' className='mt-4'>
													Save
												</Button>
											</Form>
										)}
									</Formik>
								</SidebarLinks>
								<SidebarLinks sidebarName='Template components'></SidebarLinks>
								<div
									className='bg-gray-200 p-2 m-2'
									onClick={() => addComponentHandler(typeEnum.TEXT)}
								>
									TEXT
								</div>
								<div
									className='bg-gray-200 p-2 m-2'
									onClick={() => addComponentHandler(typeEnum.GRAPH)}
								>
									GRAPH
								</div>
								<div
									className='bg-gray-200 p-2 m-2'
									onClick={() => addComponentHandler(typeEnum.TABLE)}
								>
									TABLE
								</div>
							</Sidebar>
						</div>
					</div>
					{/*Canvas*/}
					<div className='mt-10 mb-10 overflow-x-auto overflow-y-hidden'>
						<div
							className='border-2 shadow-xl relative m-auto'
							style={{ width: "210mm", height: "297mm" }}
						>
							{/*Generate stored components to canvas */}
							{components.map((i) => {
								return (
									<RndCanvasItem
										key={i.itemId}
										item={i}
										onMove={moveItemHandler}
										onSelect={selectComponentHandler}
									></RndCanvasItem>
								);
							})}
						</div>
					</div>
					{/*Right sidebar */}
					<div className='flex-1 ml-2 xl:ml-4'>
						<div className='flex justify-end h-screen sticky top-0'>
							<Sidebar className='bg-gray-300'>
								<SidebarLinks sidebarName='Edit selected component'></SidebarLinks>
								{selectedComponent &&
									Object.keys(selectedComponent).map((visit, index) => (
										<div key={index}>
											{visit} : {selectedComponent[visit]}
										</div>
									))}
							</Sidebar>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TemplateCreate;
