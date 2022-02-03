import { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/AxiosHelper";
import { useAxios } from "../../helpers/AxiosHelper";
import Loader from "../UI/Loader/Loader";
import { useHistory } from "react-router";
import CanvasRightMenu from "../Canvas/CanvasRightMenu";
import ReportMenuLeft from "./ReportMenuLeft";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";
import { useAlert } from "react-alert";
import { Tab } from "@headlessui/react";
import PDFPreview from "../Canvas/PDFPreview";
import { saveAs } from "file-saver";
import {
	generateReport,
	getReport,
	saveReport,
} from "../../services/ReportService";
import {
	CapabilityTable,
	createItemFromExisting,
	Item,
	typeEnum,
} from "../../helpers/ClassHelper";

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
	const [{}, getTemplate] = useAxios(
		{
			url: "/templates/get",
			method: "GET",
		},
		{ manual: true, useCache: false }
	);

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		setItems([]);
		if (components) {
			newComponents = components.map((i) => createItemFromExisting(i));
			setItems(newComponents);
			selectItemHandler(null);
		}
	};

	//Saves report to DB
	const saveReportHandler = async (formValues) => {
		//TODO: add validation
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
		let saveResponse;
		try {
			saveResponse = await saveReportHandler(formValues);
		} catch (e) {
			return;
		}
		try {
			const response = await generateReport(saveResponse.data.id);
			alert.info("Report generated");

			const pdfFile = new Blob([response.data], {
				type: "application/pdf;base64",
			});
			const fileURL = URL.createObjectURL(pdfFile);
			setPreviewData(fileURL);
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
			getReport(reportId)
				.then((response) => {
					setReportData(response.data);
					parseAndSetComponents(response.data.reportItems);
					setReportLoading(false);
					alert.info("Report loaded.");
				})
				.catch(() => {
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
				<div className='flex bg-gray-200'>
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
						<Tab.Group
							onChange={(index) => {
								if (index === 1) {
									selectItemHandler(null);
								}
							}}
						>
							<Tab.List className='flex justify-center pt-4'>
								<Tab
									className={({ selected }) => {
										return (
											"p-2 w-20 rounded-tl-lg rounded-bl-lg " +
											(selected
												? "bg-gray-800 text-white font-bold"
												: "bg-white text-gray-800")
										);
									}}
								>
									Canvas
								</Tab>
								<Tab
									className={({ selected }) => {
										return (
											"p-2 w-20 rounded-tr-lg rounded-br-lg " +
											(selected
												? "bg-gray-800 text-white font-bold"
												: "bg-white text-gray-800")
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
