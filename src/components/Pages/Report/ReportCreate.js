import Sidebar from "../../UI/Sidebar/Sidebar";
import SidebarLinks from "../../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../helpers/AxiosHelper";
import { useAxios } from "../../../helpers/AxiosHelper";
import Loader from "../../UI/Loader/Loader";
import FormHidden from "../../UI/Form/FormHidden";
import FormInput from "../../UI/Form/FormInput";
import Button from "../../UI/Button";
import RndCanvasItem from "../../UI/CanvasItem/RndCanvasItem";
import FormSelect from "../../UI/Form/FormSelect";
import { useHistory } from "react-router";

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

const ReportCreate = ({ mode, reportId }) => {
	//Stores all components currently on canvas
	const [components, setComponents] = useState([]);
	const [selectedComponent, setSelectedComponent] = useState(null);
	const [selectTemplates, setSelectTemplates] = useState([]);
	let history = useHistory();

	//Get current template - used for reseting of data
	const [
		{ data: templateData, loading: templateLoading, error: templateError },
		getTemplate,
	] = useAxios(
		{
			url: "/template/get",
			method: "GET",
			params: { reportId: reportId },
		},
		{ manual: true }
	);

	//Get all templates for select form input
	const [
		{ data: selectData, loading: selectLoading, error: selectError },
		getSelectData,
	] = useAxios("/template/getAll", { useCache: false, manual: true });

	//Get current report for edit mode
	const [
		{ data: reportData, loading: reportLoading, error: reportError },
		getReport,
	] = useAxios(
		{
			url: "/report/get",
			method: "GET",
			params: { reportId: reportId },
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

	//Parse templates to value:"", label:""
	const parseTemplates = (templates) => {
		let array = [];
		if (templates)
			templates.forEach((template) =>
				array.push({ value: template.templateId, label: template.templateName })
			);
		return array;
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
			.post("/report/save", {
				reportId: formValues.id,
				reportName: formValues.reportName,
				reportItems:
					//TODO REMOVE LINE AFTER : - new items are created every time
					mode === "create"
						? components.map((e) => ({ ...e, itemId: null }))
						: components.map((e) => ({ ...e, itemId: null })),
				reportTemplate: {
					templateId: formValues.templateId,
				},
			})
			.then(function (response) {
				history.push("/report");
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
		setSelectedComponent(id);
	};

	useEffect(() => {
		if (mode === "edit") getReport();
		getSelectData().then((response) => {
			setSelectTemplates(parseTemplates(response.data));
		});
	}, []);

	useEffect(() => {
		if (reportData) {
			const newComponents = reportData.reportItems.map(
				(i) => new Item(i.itemId, i.x, i.y, i.width, i.height, i.type)
			);
			setComponents(newComponents);
		}
	}, [reportData]);

	return (
		<>
			{reportLoading && mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex items-center justify-center flex-grow'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex'>
					{/*Left sidebar */}
					<div className='flex-1 mr-2 xl:mr-4'>
						<div className='sticky top-0 flex justify-start h-screen'>
							<Sidebar className='overflow-y-auto bg-gray-300'>
								<SidebarLinks sidebarName='Report'>
									<Formik
										initialValues={{
											id: reportData ? reportData.reportId : null,
											reportName: reportData ? reportData.reportName : "",
											templateId: reportData
												? reportData.reportTemplate
													? reportData.reportTemplate.templateId
													: ""
												: "",
										}}
										validationSchema={Yup.object({
											reportName: Yup.string().required("Required"),
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
													label='Report name'
													name='reportName'
													type='text'
													placeholder='Template name...'
												/>
												<label className='mt-2' htmlFor='template'>
													Based on template
												</label>
												<Field
													name='templateId'
													options={selectTemplates}
													component={FormSelect}
													placeholder={
														selectError
															? "No templates found"
															: "Select template"
													}
													isMulti={false}
													isLoading={selectLoading}
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
									className='p-2 m-2 bg-gray-200'
									onClick={() => addComponentHandler(typeEnum.TEXT)}
								>
									TEXT
								</div>
								<div
									className='p-2 m-2 bg-gray-200'
									onClick={() => addComponentHandler(typeEnum.GRAPH)}
								>
									GRAPH
								</div>
								<div
									className='p-2 m-2 bg-gray-200'
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
							className='relative m-auto border-2 shadow-xl'
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
						<div className='sticky top-0 flex justify-end h-screen'>
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

export default ReportCreate;
