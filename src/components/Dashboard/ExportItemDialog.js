import { Field, Form, Formik } from "formik";
import Button from "../UI/Button";
import MyDialog from "../UI/Dialog/MyDialog";
import FormSelect from "../UI/Form/FormSelect";
import * as Yup from "yup";
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getAllSimple } from "../../services/ReportService";
import TemplateService from "../../services/TemplateService";
import { useHistory } from "react-router-dom";

const ExportItemDialog = ({ item, showDialog, onClose }) => {
	//0 - report, 1 - template
	const [selected, setSelected] = useState(0);
	const [reportData, setReportData] = useState({
		data: null,
		loading: false,
		error: false,
	});
	const [templateData, setTemplateData] = useState({
		data: null,
		loading: false,
		error: false,
	});
	const { push } = useHistory();

	const fetchReports = async () => {
		setReportData({ data: [], loading: true, error: false });
		try {
			const response = await getAllSimple();
			const newData = response.data.map(({ id, reportName }) => ({
				value: id,
				label: reportName,
			}));

			setReportData((prevState) => ({
				...prevState,
				data: newData,
				loading: false,
			}));
		} catch (e) {
			setReportData((prevState) => ({
				...prevState,
				loading: false,
				error: true,
			}));
		}
	};

	const fetchTemplates = async () => {
		setTemplateData({ data: [], loading: true, error: false });
		try {
			const response = await TemplateService.getAllSimple();
			const newData = response.data.map(({ id, templateName }) => ({
				value: id,
				label: templateName,
			}));

			setTemplateData((prevState) => ({
				...prevState,
				data: newData,
				loading: false,
			}));
		} catch (e) {
			setTemplateData((prevState) => ({
				...prevState,
				loading: false,
				error: true,
			}));
		}
	};

	const getItemForCanvas = () => {
		const { h: height, w: width, ...rest } = item;
		let canvasItem = { height, width, ...rest };
		canvasItem.x = 0;
		canvasItem.y = 0;
		canvasItem.height = 200;
		canvasItem.width = 200;
		return canvasItem;
	};

	const addItemHandler = (selecteId) => {
		debugger;
		if (selected === 0) {
			push({
				pathname: "/report/create",
				state: { mode: "edit", reportId: selecteId, item: getItemForCanvas() },
			});
		} else {
			push({
				pathname: "/template/create",
				state: {
					mode: "edit",
					templateId: selecteId,
					item: getItemForCanvas(),
				},
			});
		}
	};

	useEffect(() => {
		fetchReports();
	}, []);

	return (
		<MyDialog
			title='Add item to report/template'
			description='Adds selected item to selected report or template. Chosen report/template will open in edit mode.'
			isOpen={showDialog}
			onClose={onClose}
		>
			<Formik
				initialValues={{}}
				validationSchema={Yup.object().shape({
					id: Yup.string().required("Required"),
				})}
				onSubmit={(values) => addItemHandler(values.id)}
			>
				{({ errors, setFieldValue }) => (
					<Form className='flex justify-center flex-col items-center'>
						<div className='w-64'>
							<Tab.Group
								onChange={(index) => {
									setFieldValue("id", "", false);
									if (index === 0) {
										!reportData.data && fetchReports();
									} else {
										!templateData.data && fetchTemplates();
									}
									setSelected(index);
								}}
							>
								<Tab.List className='flex justify-center pb-4'>
									<Tab
										className={({ selected }) => {
											return (
												"p-2 w-20 rounded-tl-lg rounded-bl-lg border border-gray-800 text-sm " +
												(selected
													? "bg-gray-800 text-white"
													: "bg-white text-gray-800")
											);
										}}
									>
										Report
									</Tab>
									<Tab
										className={({ selected }) => {
											return (
												"p-2 w-20 rounded-tr-lg rounded-br-lg border border-gray-800 text-sm " +
												(selected
													? "bg-gray-800 text-white"
													: "bg-white text-gray-800")
											);
										}}
									>
										Template
									</Tab>
								</Tab.List>
								<Tab.Panels>
									<Tab.Panel>
										<label>Select report:</label>
									</Tab.Panel>
									<Tab.Panel>
										<label>Select template:</label>
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
							<Field
								name='id'
								options={selected === 0 ? reportData.data : templateData.data}
								component={FormSelect}
								placeholder={
									selected === 0
										? reportData.loading
											? "Loading..."
											: reportData.error
											? "Error getting reports"
											: reportData.data && reportData.data.length > 0
											? "Select report"
											: "No reports found"
										: templateData.loading
										? "Loading..."
										: templateData.error
										? "Error getting templates"
										: templateData.data && templateData.data.length > 0
										? "Select template"
										: "No templates found"
								}
								isMulti={false}
								isLoading={
									selected === 0 ? reportData.loading : templateData.loading
								}
								error={errors.id}
							/>
						</div>
						<div className='flex flex-row justify-center pt-4 space-x-4'>
							<Button className='w-24' type='submit' dark={true}>
								Add item
							</Button>
							<Button className='w-24' onClick={() => onClose()}>
								Cancel
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</MyDialog>
	);
};

export default ExportItemDialog;
