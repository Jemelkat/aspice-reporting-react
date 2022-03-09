import { Field, Form, Formik } from "formik";
import Button from "../../ui/Button";
import SidebarDisclosure from "../../ui/Sidebar/SidebarDisclosure";
import FormHidden from "../../ui/Form/FormHidden";
import FormInput from "../../ui/Form/FormInput";
import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import * as Yup from "yup";
import { PlusIcon } from "@heroicons/react/solid";
import FormSelect from "../../ui/Form/FormSelect";
import { useAxios } from "../../helpers/AxiosHelper";
import { typeEnum } from "../../helpers/ClassHelper";
import SidebarCanvasItem from "../../ui/Sidebar/SidebarCanvasItem";
import { ReactComponent as SVGBarHorizontal } from "../../assets/barchart-horizontal.svg";
import { ReactComponent as SVGPie } from "../../assets/piechart.svg";
import { ReactComponent as SVGSimpleTable } from "../../assets/simple-table.svg";
import { ReactComponent as SVGCapabilityTable } from "../../assets/capability-table.svg";

const ReportMenu = ({
	data,
	onSave,
	onOrientationChange,
	onAddComponent,
	onTemplateChange,
	onReportGenerate,
	onDownloadReport,
	isProcessing,
}) => {
	//Get all templates for select form input
	const [{ data: selectData, loading: selectLoading, error: selectError }] =
		useAxios("/templates/getAll", { useCache: false });

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
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLink sidebarName='Report'>
						<Formik
							enableReinitialize={true}
							initialValues={{
								id: data ? data.id : "",
								reportName: data ? data.reportName : "",
								orientation: data?.orientation ? data.orientation : "VERTICAL",
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
										Orientation
									</label>
									<Field
										name='orientation'
										options={[
											{ value: "VERTICAL", label: "VERTICAL" },
											{ value: "HORIZONTAL", label: "HORIZONTAL" },
										]}
										onSelect={(e) => {
											if (e.value !== values.orientation) {
												onOrientationChange(e.value);
											}
										}}
										component={FormSelect}
										isMulti={false}
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
											if (!isProcessing) {
												if (
													window.confirm(
														"Applying template will reset canvas layout. Do you really want to reset this report?"
													)
												) {
													onTemplateChange(values.templateId);
												}
											}
										}}
									>
										Apply template
									</Button>
									<Button type={!isProcessing && "submit"} className='mt-4'>
										Save
									</Button>
									<Button
										type='button'
										onClick={() => {
											!isProcessing &&
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
											!isProcessing &&
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
					</SidebarLink>

					<SidebarLink sidebarName='Items'>
						<span className='w-full pt-2 pb-2 pl-5 pr-5 text-sm text-center'>
							Click on item to add it to report
						</span>
					</SidebarLink>
					<SidebarDisclosure name='Text components' dark>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.TEXT)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							TEXT
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Graph components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SidebarCanvasItem
								mini
								name={"Capability bar"}
								onClick={() => {
									onAddComponent(typeEnum.CAPABILITY_BAR_GRAPH);
								}}
							>
								<SVGBarHorizontal />
							</SidebarCanvasItem>
							<SidebarCanvasItem
								mini
								name={"Level pie"}
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_PIE_GRAPH);
								}}
							>
								<SVGPie />
							</SidebarCanvasItem>
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Table components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SidebarCanvasItem
								mini
								name={"Table"}
								onClick={() => {
									onAddComponent(typeEnum.SIMPLE_TABLE);
								}}
							>
								<SVGSimpleTable />
							</SidebarCanvasItem>
							<SidebarCanvasItem
								mini
								name={"Capability table"}
								onClick={() => {
									onAddComponent(typeEnum.CAPABILITY_TABLE);
								}}
							>
								<SVGCapabilityTable />
							</SidebarCanvasItem>
						</div>
					</SidebarDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default ReportMenu;
