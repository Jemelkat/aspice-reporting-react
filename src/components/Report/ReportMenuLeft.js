import { Field, Form, Formik } from "formik";
import Button from "../UI/Button";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { PlusIcon } from "@heroicons/react/solid";
import FormSelect from "../UI/Form/FormSelect";
import { useAxios } from "../../helpers/AxiosHelper";
import { useAlert } from "react-alert";
import { typeEnum } from "../../helpers/ClassHelper";

const ReportMenuLeft = ({
	data,
	onSave,
	onAddComponent,
	onTemplateChange,
	onReportGenerate,
	onDownloadReport,
}) => {
	//Get all templates for select form input
	const [{ data: selectData, loading: selectLoading, error: selectError }] =
		useAxios("/templates/getAll", { useCache: false });
	const alert = useAlert();

	//Parse templates to value:"", label:""
	const parseTemplates = (templates) => {
		let array = [];
		if (templates)
			templates.forEach((template) =>
				array.push({ value: template.id, label: template.templateName })
			);
		array.push({ value: "", label: "None" });
		return array;
	};

	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white border-2 shadow-xl'>
					<SidebarLinks sidebarName='Report'>
						<Formik
							enableReinitialize={true}
							initialValues={{
								id: data ? data.id : "",
								reportName: data ? data.reportName : "",
								templateId: data
									? data.reportTemplate
										? data.reportTemplate.id
										: ""
									: "",
							}}
							validationSchema={Yup.object({
								reportName: Yup.string().required("Required"),
							})}
							onSubmit={(values, { setSubmitting }) => {
								onSave(values);
								setSubmitting(false);
							}}
						>
							{({ values, validateForm }) => (
								<Form className='flex flex-col p-4'>
									<FormHidden name='id'></FormHidden>
									<FormInput
										label='Report name'
										name='reportName'
										type='text'
										placeholder='Report name...'
									/>
									<label className='mt-2' htmlFor='template'>
										Based on template
									</label>
									<Field
										name='templateId'
										options={parseTemplates(selectData)}
										component={FormSelect}
										placeholder={
											selectError ? "No templates found" : "Select template"
										}
										isMulti={false}
										isLoading={selectLoading}
									/>
									<Button
										type='button'
										onClick={() => {
											if (
												window.confirm(
													"Applying template will reset canvas layout. Do you really want to reset this report?"
												)
											) {
												onTemplateChange(values.templateId);
											}
										}}
									>
										Apply template
									</Button>
									<Button type='submit' className='mt-4'>
										Save
									</Button>
									<Button
										type='button'
										onClick={() => {
											validateForm(values).then((response) => {
												Object.keys(response).length === 0 &&
													onReportGenerate(values);
											});
										}}
										className='mt-1'
										dark={true}
									>
										{"Save & Generate"}
									</Button>
									<Button
										type='button'
										onClick={() => {
											validateForm(values).then((response) => {
												Object.keys(response).length === 0 &&
													onDownloadReport(values);
											});
										}}
										className='mt-4'
										dark={true}
									>
										{"Download"}
									</Button>
								</Form>
							)}
						</Formik>
					</SidebarLinks>
					<SidebarLinks sidebarName='Template components'></SidebarLinks>
					<CanvasPanelDisclosure name='Text components'>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.TEXT)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							TEXT
						</div>
					</CanvasPanelDisclosure>
					<CanvasPanelDisclosure name='Graph components'>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.GRAPH)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							GRAPH
						</div>
					</CanvasPanelDisclosure>
					<CanvasPanelDisclosure name='Table components'>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.SIMPLE_TABLE)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							TABLE
						</div>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.CAPABILITY_TABLE)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							CAPABILITY TABLE
						</div>
					</CanvasPanelDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default ReportMenuLeft;
