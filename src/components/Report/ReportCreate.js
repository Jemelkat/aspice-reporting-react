import { useEffect, useState } from "react";
import { useAxios } from "../../helpers/AxiosHelper";
import Loader from "../../ui/Loader/Loader";
import { useHistory } from "react-router";
import ItemSettingsMenu from "../ComponentSettings/ItemSettingsMenu";
import ReportMenu from "./ReportMenu";
import useCanvas from "../../hooks/useCanvas";
import Canvas from "../Canvas/Canvas";
import { useAlert } from "react-alert";
import { Tab } from "@headlessui/react";
import PDFPreview from "../Canvas/PDFPreview";
import { saveAs } from "file-saver";
import ReportService from "../../services/ReportService";
import { createItemFromExisting } from "../../helpers/ClassHelper";
import ReactPaginate from "react-paginate";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";

const ReportCreate = ({ mode, reportId, addItem = null }) => {
	const [reportData, setReportData] = useState(null);
	const [reportLoading, setReportLoading] = useState(true);
	const [previewData, setPreviewData] = useState(null);
	const [isProcessing, setProcessing] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [numberOfPages, setNumberOfPages] = useState(1);
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
		orientationHandler,
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
			newComponents = components.map((i) => {
				return createItemFromExisting(i);
			});
			setItems(newComponents);
			selectItemHandler(null);
		}
	};

	//Saves report to DB
	const saveReportHandler = async (formValues) => {
		setProcessing(true);
		try {
			const response = await ReportService.saveReport(formValues, items, mode);
			parseAndSetComponents(response.data.reportItems);
			setReportData(response.data);
			setProcessing(false);
			alert.info("Report saved");
			return response;
		} catch (e) {
			setProcessing(false);
			if (e.response?.data && e.response?.data.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error saving report.");
			}
			throw e;
		}
	};

	//Saves and generates report as response
	const generateReportHandler = async (formValues) => {
		let saveResponse;
		setProcessing(true);
		try {
			saveResponse = await saveReportHandler(formValues);
		} catch (e) {
			setProcessing(false);
			return;
		}
		try {
			const response = await ReportService.generateReport(saveResponse.data.id);
			alert.info("Report generated");

			const pdfFile = new Blob([response.data], {
				type: "application/pdf;base64",
			});
			const fileURL = URL.createObjectURL(pdfFile);
			setPreviewData(fileURL);
			setProcessing(false);
			return response;
		} catch (e) {
			let responseData = null;
			if (e.response?.data.size > 0) {
				responseData = JSON.parse(await e.response?.data.text());
			}
			setProcessing(false);
			if (responseData && responseData?.message) {
				alert.error(responseData.message);
			} else {
				alert.error("Error generating report.");
			}
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
				setReportData((prevState) => ({
					...prevState,
					orientation: response.data.orientation,
				}));
				parseAndSetComponents(response.data.templateItems);
				selectItemHandler(null);
			});
		else {
			setItems([]);
			selectItemHandler(null);
		}
	};

	const orientationChangeHandler = (orientation) => {
		debugger;
		setReportData((prevState) => ({ ...prevState, orientation: orientation }));
		orientationHandler(orientation);
	};

	useEffect(() => {
		if (mode === "edit") {
			setReportLoading(true);
			ReportService.getReport(reportId)
				.then((response) => {
					let loadedItems = response.data;
					//Add new item if report was redirected from dashboard
					if (addItem) {
						let addedItemId = 0;
						if (loadedItems.length > 0) {
							addedItemId =
								Math.max.apply(
									null,
									loadedItems.reportItems.map((item) => item.id)
								) + 1;
						}
						//Set new ID to added item as max + 1 or 0 if template is empty
						let updatedAddItem = addItem;
						updatedAddItem.id = addedItemId;
						loadedItems.reportItems.push(updatedAddItem);
					}
					setReportData(loadedItems);
					parseAndSetComponents(loadedItems.reportItems);
					setReportLoading(false);
					alert.info("Report loaded.");
				})
				.catch(() => {
					alert.error("Error getting report data.");
					history.push("/report");
				});
		} else {
			setReportLoading(false);
		}
	}, []);

	const handlePageClick = (event) => {
		setCurrentPage(event.selected);
	};

	const addPageHandler = () => {
		setNumberOfPages(numberOfPages + 1);
	};

	const removePageHandler = () => {
		const newNumberOfPages = numberOfPages - 1;
		if (numberOfPages > 1) {
			setNumberOfPages(newNumberOfPages);
			if (currentPage >= newNumberOfPages) {
				setCurrentPage(newNumberOfPages - 1);
			}
		}
	};

	return (
		<>
			{reportLoading && mode === "edit" ? (
				<div className='flex flex-col items-center justify-center h-screen-header'>
					<Loader>Loading report data...</Loader>
				</div>
			) : (
				<div className='flex bg-gray-200'>
					{/*Left sidebar */}
					<ReportMenu
						data={reportData}
						onOrientationChange={orientationChangeHandler}
						onSave={saveReportHandler}
						onAddComponent={addItemHandler}
						onTemplateChange={applyTemplateHandler}
						onReportGenerate={generateReportHandler}
						onDownloadReport={downloadReportHandler}
						isProcessing={isProcessing}
					></ReportMenu>
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
											"p-2 w-20 rounded-tr-lg rounded-br-lg  " +
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
									<div className='flex flex-col items-center justify-center pt-2'>
										<ReactPaginate
											forcePage={currentPage}
											nextLabel={">"}
											onPageChange={handlePageClick}
											pageRangeDisplayed={2}
											marginPagesDisplayed={1}
											pageCount={numberOfPages}
											previousLabel={"<"}
											pageClassName='border text-lg border-gray-800 w-8 text-center h-8 rounded-lg'
											pageLinkClassName=''
											previousClassName=' border border-gray-800 bg-gray-800 text-white rounded-lg text-lg  text-center h-8 w-8 mr-2'
											previousLinkClassName=''
											nextClassName='border border-gray-800 bg-gray-800 text-white text-lg rounded-lg text-center h-8 w-8 ml-2'
											nextLinkClassName=''
											breakLabel='...'
											breakClassName='pl-2 pr-2'
											breakLinkClassName=''
											containerClassName='flex items-center justify-center'
											activeClassName='bg-gray-800 text-white border-gray-800'
											renderOnZeroPageCount={null}
										/>
										<div className='flex items-center' onClick={addPageHandler}>
											<span className='flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg cursor-pointer'>
												<PlusIcon className='w-5 h-5 text-white'></PlusIcon>
											</span>
											<span className='pl-2'>Add page</span>
										</div>
										<div
											className='flex items-center'
											onClick={removePageHandler}
										>
											<span className='flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg cursor-pointer'>
												<MinusIcon className='w-5 h-5 text-white'></MinusIcon>
											</span>
											<span className='pl-2'>Remove page</span>
										</div>
									</div>
									{/*Canvas */}
									<Canvas
										items={items}
										orientation={reportData?.orientation}
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

export default ReportCreate;
