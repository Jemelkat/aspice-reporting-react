import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
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
import { useAlert } from "react-alert";
import { Tab } from "@headlessui/react";
import PDFPreview from "../Preview/PDFPreview";
import { saveAs } from "file-saver";
import { generateReport, saveReport } from "../../services/ReportService";

const typeEnum = Object.freeze({
	GRAPH: "GRAPH",
	STATIC_TEXT: "STATIC_TEXT",
	TABLE: "TABLE",
});

class Item {
	constructor(id, x, y, width, height, type, textArea) {
		this.itemId = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.textArea = textArea;
	}
}

const ReportCreate = ({ mode, reportId }) => {
	const [reportData, setReportData] = useState(null);
	const [reportLoading, setReportLoading] = useState(true);
	const [previewData, setPreviewData] = useState(null);

	const alert = useAlert();
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
		updateItemHandler,
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

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		setItems([]);
		if (components) {
			newComponents = components.map(
				(i) =>
					new Item(
						i.itemId,
						i.x,
						i.y,
						i.width,
						i.height,
						i.type,
						i.textArea ? i.textArea : null
					)
			);
			setItems(newComponents);
		}
	};

	//Saves report to DB
	const saveReportHandler = async (formValues) => {
		try {
			const response = await saveReport(formValues, items, mode);
			parseAndSetComponents(response.data.reportItems);
			setReportData(response.data);
			alert.info("Report saved");
			return response;
		} catch (e) {
			alert.error("Error saving report.");
			throw e;
		}
	};

	//Saves and generates report as response
	const generateReportHandler = async (formValues) => {
		const saveResponse = await saveReportHandler(formValues);
		try {
			const response = await generateReport(saveResponse.data.reportId);
			setPreviewData(response.data);
			console.log("generaete", response.data);
			alert.info("Report generated");
			return response;
		} catch (e) {
			alert.error("Error generating report.");
			throw e;
		}
	};

	//Saves, generates and downloads report
	const downloadReportHandler = (formValues) => {
		generateReportHandler(formValues).then((generateResponse) => {
			saveAs(generateResponse.data, formValues.reportName + ".pdf");
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
		if (mode === "edit") {
			setReportLoading(true);
			axiosInstance
				.get("/report/get", { params: { reportId: reportId } })
				.then((response) => {
					setReportData(response.data);
					parseAndSetComponents(response.data.reportItems);
					setReportLoading(false);
					alert.info("Report loaded.");
				})
				.catch((error) => {
					alert.error("Error getting report date.");
					history.push("/report");
				});
		} else {
			setReportLoading(false);
		}
	}, []);

	return (
		<>
			{reportLoading && mode === "edit" ? (
				/**TODO ADJUST TO MIDDLE */
				<div className='flex items-center justify-center flex-grow'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<div className='flex overflow-x-hidden'>
					{/*Left sidebar */}
					<ReportMenuLeft
						data={reportData}
						onSave={saveReportHandler}
						onAddComponent={addItemHandler}
						onTemplateChange={applyTemplateHandler}
						onReportGenerate={generateReportHandler}
						onDownloadReport={downloadReportHandler}
					></ReportMenuLeft>
					{/*Canvas*/}
					<div className='overflow-x-auto overflow-y-hidden'>
						<Tab.Group>
							<Tab.List className='flex justify-center pt-4'>
								<Tab
									className={({ selected }) => {
										return (
											"p-2 w-20 rounded-tl-lg rounded-bl-lg " +
											(selected
												? "bg-gray-800 text-white font-bold"
												: "bg-gray-200 text-gray-800")
										);
									}}
								>
									Canvas
								</Tab>
								<Tab
									className={({ selected }) => {
										return (
											"p-2 w-20 rounded-tr-lg rounded-br-lg font-bold " +
											(selected
												? "bg-gray-800 text-white font-bold"
												: "bg-gray-200 text-gray-800")
										);
									}}
								>
									Preview
								</Tab>
							</Tab.List>
							<Tab.Panels>
								<Tab.Panel>
									{/*Canvas */}
									<Canvas
										items={items}
										selectedItem={selectedItem}
										onMove={moveItemHandler}
										onSelect={selectItemHandler}
										onResize={resizeItemHandler}
										onDeleteItem={deleteItemHandler}
									></Canvas>
								</Tab.Panel>
								<Tab.Panel>
									{/*Preview */}
									<div className='mt-4 mb-10 overflow-x-auto overflow-y-hidden border-2'>
										<PDFPreview pdfData={previewData}></PDFPreview>
									</div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
					{/*Right sidebar */}
					<CanvasRightMenu
						show={showSelected}
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

export default ReportCreate;
