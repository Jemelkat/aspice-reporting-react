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
import ValidationService from "../../services/ValidationService";

const ReportCreate = ({ mode, reportId, addItem = null }) => {
	const [reportLoading, setReportLoading] = useState(true);
	const [previewData, setPreviewData] = useState(null);
	const [isProcessing, setProcessing] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [numberOfPages, setNumberOfPages] = useState(1);
	const [pagesData, setPagesData] = useState([
		{ id: null, orientation: "VERTICAL", pageTemplate: null },
	]);
	const [reportData, setReportData] = useState({ id: null, reportName: "" });
	const [itemErrors, setItemErrors] = useState(null);
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

	useEffect(() => {
		if (itemErrors) {
			alert.error(itemErrors.error);
			setCurrentPage(itemErrors.page);
			selectItemHandler(itemErrors.id, itemErrors.page);
		}
	}, [itemErrors]);

	const parseAndSetItems = (reportPages) => {
		let newItems = [];
		let newPages = [];
		for (let i = 0; i < reportPages.length; i++) {
			const page = reportPages[i];
			let pageItems = [];
			if (page) {
				pageItems = page.reportItems.map((i) => createItemFromExisting(i));
			}
			newItems.push(pageItems);
			newPages.push({
				id: page.id,
				orientation: page.orientation,
				pageTemplate: page.pageTemplate,
			});
		}

		setNumberOfPages(reportPages.length > 0 ? reportPages.length : 1);
		setItems(newItems);
		setPagesData(newPages);
		selectItemHandler(null);
		return newItems;
	};

	//Saves report to DB
	const saveReportHandler = async (formValues) => {
		setItemErrors(null);
		setProcessing(true);
		try {
			let report = {
				id: formValues.id,
				reportName: formValues.reportName,
				reportPages: pagesData.map((page, index) => {
					return { ...page, reportItems: items[index] };
				}),
			};
			const response = await ReportService.saveReport(report);
			const newItems = parseAndSetItems(response.data.reportPages);
			setReportData({
				id: response.data.id,
				reportName: response.data.reportName,
			});
			setProcessing(false);
			alert.info("Report saved");
			return { response, newItems };
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
		//Validate if all items are filled in
		const errors = ValidationService.validateItemsFilled(saveResponse.newItems);
		if (errors !== null) {
			setItemErrors(errors);
			return;
		}
		try {
			const response = await ReportService.generateReport(
				saveResponse.response.data.id
			);
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

	const applyTemplateHandler = (templateId, page) => {
		if (templateId !== "")
			getTemplate({ params: { templateId: templateId } }).then((response) => {
				let newItems = response.data.templateItems.map((i) =>
					createItemFromExisting(i)
				);
				let newPage = {
					id: null,
					orientation: response.data.orientation,
					pageTemplate: { id: templateId },
				};

				let newItemsCombined = [...items];
				newItemsCombined.splice(page, 1, newItems);
				let newPagesCombined = [...pagesData];
				newPagesCombined.splice(page, 1, newPage);
				setItems(newItemsCombined);
				setPagesData(newPagesCombined);
				selectItemHandler(null);
			});
		else {
			let newItemsCombined = [...items];
			newItemsCombined.splice(page, 1, []);
			setItems(newItemsCombined);
			selectItemHandler(null);
		}
	};

	const orientationChangeHandler = (newOrientation) => {
		let newPageData = [...pagesData];
		newPageData.splice(currentPage, 1, {
			...pagesData[currentPage],
			orientation: newOrientation,
		});
		setPagesData(newPageData);
		orientationHandler(newOrientation, currentPage);
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
						if (loadedItems.reportPages[0].length > 0) {
							addedItemId =
								Math.max.apply(
									null,
									loadedItems.reportPages[0].reportItems.map((item) => item.id)
								) + 1;
						}
						//Set new ID to added item as max + 1 or 0 if template is empty
						let updatedAddItem = addItem;
						updatedAddItem.id = addedItemId;
						loadedItems.reportPages[0].reportItems.push(updatedAddItem);
					}
					let newPages = loadedItems.reportPages.map((page) => {
						return {
							id: page.id,
							orienation: page.orientation,
							pageTemplate: { id: page.pageTemplate },
						};
					});
					setPagesData(newPages);
					parseAndSetItems(loadedItems.reportPages);
					setReportData({ id: reportId, reportName: loadedItems.reportName });
					setReportLoading(false);
					alert.info("Report loaded.");
				})
				.catch(() => {
					alert.error("Error getting report data.");
					history.push("/report");
				});
		} else {
			setReportLoading(false);
			setItems([[]]);
		}
	}, []);

	const handlePageClick = (event) => {
		setCurrentPage(event.selected);
		selectItemHandler(null);
	};

	const addPageHandler = () => {
		setNumberOfPages(numberOfPages + 1);
		let newItems = items;
		newItems.push([]);
		let newPages = pagesData;
		newPages.push({
			id: null,
			orientation: "VERTICAL",
			pageTemplate: null,
		});
		setPagesData(newPages);
		setItems(newItems);
	};

	const removePageHandler = () => {
		const newNumberOfPages = numberOfPages - 1;
		if (numberOfPages > 1) {
			setNumberOfPages(newNumberOfPages);
			let newItems = items;
			newItems.splice(currentPage, 1);
			let newPages = pagesData;
			newPages.splice(currentPage, 1);
			setPagesData(newPages);
			setItems(newItems);
			if (currentPage >= newNumberOfPages) {
				setCurrentPage(newNumberOfPages - 1);
			}
		}
	};

	const reportNameHandler = (name) => {
		setReportData((prev) => {
			return { ...prev, reportName: name };
		});
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
						id={reportData.id}
						templateId={pagesData[currentPage].pageTemplate?.id}
						name={reportData.reportName}
						onSetName={reportNameHandler}
						orientation={pagesData[currentPage].orientation}
						page={currentPage}
						onOrientationChange={orientationChangeHandler}
						onSave={saveReportHandler}
						onAddComponent={addItemHandler}
						onTemplateChange={applyTemplateHandler}
						onReportGenerate={generateReportHandler}
						onDownloadReport={downloadReportHandler}
						isProcessing={isProcessing}
						onAddPage={addPageHandler}
						onRemovePage={removePageHandler}
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
									{/*Canvas */}
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
										containerClassName='flex items-center pt-2 justify-center'
										activeClassName='bg-gray-800 text-white border-gray-800'
										renderOnZeroPageCount={null}
									/>
									<Canvas
										items={items[currentPage]}
										page={currentPage}
										error={itemErrors}
										orientation={pagesData[currentPage].orientation}
										selectedItem={selectedItem}
										onMove={moveItemHandler}
										onSelect={selectItemHandler}
										onResize={resizeItemHandler}
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
						page={currentPage}
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
