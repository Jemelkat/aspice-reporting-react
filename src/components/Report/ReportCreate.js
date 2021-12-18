import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/AxiosHelper";
import { useAxios } from "../../helpers/AxiosHelper";
import Loader from "../UI/Loader/Loader";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Button from "../UI/Button";
import RndCanvasItem from "../UI/Canvas/RndCanvasItem";
import FormSelect from "../UI/Form/FormSelect";
import { useHistory } from "react-router";
import CanvasRightMenu from "../Canvas/CanvasRightMenu";
import ReportMenuLeft from "./ReportMenuLeft";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";

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
	let history = useHistory();
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

	//Get current template - used for reseting of data
	const [
		{ data: templateData, loading: templateLoading, error: templateError },
		getTemplate,
	] = useAxios(
		{
			url: "/template/get",
			method: "GET",
		},
		{ manual: true }
	);

	//Get current report for edit mode
	const [{ data: data, loading: dataLoading, error: dataError }, getReport] =
		useAxios(
			{
				url: "/report/get",
				method: "GET",
				params: { reportId: reportId },
			},
			{ useCache: false, manual: true }
		);

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		setItems([]);
		if (components) {
			newComponents = components.map(
				(i) => new Item(i.itemId, i.x, i.y, i.width, i.height, i.type)
			);
			setItems(newComponents);
		}
	};

	//Saves report to DB
	const saveReportHandler = (formValues) => {
		axiosInstance
			.post("/report/save", {
				reportId: formValues.id,
				reportName: formValues.reportName,
				reportItems:
					//TODO REMOVE LINE AFTER : - new items are created every time
					mode === "create"
						? items.map((e) => ({ ...e, itemId: null }))
						: items.map((e) => ({ ...e, itemId: null })),
				reportTemplate:
					formValues.templateId !== ""
						? {
								templateId: formValues.templateId,
						  }
						: null,
			})
			.then(function (response) {
				history.push("/report");
			})
			.catch(function (error) {
				//TODO ADD ALERT
				console.log(error);
			});
	};

	const applyTemplateHandler = (templateId) => {
		if (templateId !== "")
			getTemplate({ params: { templateId: templateId } }).then((response) => {
				parseAndSetComponents(response.data.templateItems);
				selectItemHandler(null);
			});
		else {
			setItems([]);
			selectItemHandler(null);
		}
	};

	useEffect(() => {
		if (mode === "edit") getReport();
	}, []);

	useEffect(() => {
		if (data) {
			parseAndSetComponents(data.reportItems);
		}
	}, [data]);

	return (
		<>
			{dataLoading && mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex items-center justify-center flex-grow'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex overflow-x-hidden'>
					{/*Left sidebar */}
					<ReportMenuLeft
						data={data}
						onSave={saveReportHandler}
						onAddComponent={addItemHandler}
						onTemplateChange={applyTemplateHandler}
					></ReportMenuLeft>
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
						selectedComponent={selectedItem}
						onDeleteItem={deleteItemHandler}
						onLayerChange={layerItemHandler}
					></CanvasRightMenu>
				</div>
			)}
		</>
	);
};

export default ReportCreate;
