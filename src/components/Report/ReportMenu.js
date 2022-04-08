import { Field, Form, Formik } from "formik";
import Button from "../../ui/Button";
import SidebarDisclosure from "../../ui/Sidebar/SidebarDisclosure";
import FormHidden from "../../ui/Form/FormHidden";
import FormInput from "../../ui/Form/FormInput";
import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import * as Yup from "yup";
import FormSelect from "../../ui/Form/FormSelect";
import { useAxios } from "../../helpers/AxiosHelper";
import { typeEnum } from "../../helpers/ClassHelper";
import LevelBarGraphBox from "../../ui/ItemMenuBox/LevelBarGraphBox";
import LevelPieGraphBox from "../../ui/ItemMenuBox/LevelPieGraphBox";
import SimpleTextBox from "../../ui/ItemMenuBox/SimpleTextBox";
import CapabilityTableBox from "../../ui/ItemMenuBox/CapabilityTableBox";
import SimpleTableBox from "../../ui/ItemMenuBox/SimpleTableBox";

const ReportMenu = ({
	id,
	templateId,
	name,
	onSetName,
	page,
	orientation,
	onSave,
	onOrientationChange,
	onAddComponent,
	onTemplateChange,
	onReportGenerate,
	onDownloadReport,
	isProcessing,
	onAddPage,
	onRemovePage,
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
				<Sidebar className='overflow-x-hidden overflow-y-auto bg-white shadow-xl'>
					<SidebarLink sidebarName='Report'>
						<Formik
							enableReinitialize={true}
							initialValues={{
								id: id,
								reportName: name,
								orientation: orientation,
								templateId: templateId,
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
										onChange={(e) => onSetName(e.target.value)}
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
													onTemplateChange(values.templateId, page);
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
									<Button
										type='button'
										onClick={onAddPage}
										className='mt-4'
										dark={false}
									>
										{"Add page"}
									</Button>
									<Button
										type='button'
										onClick={onRemovePage}
										className='mt-0.5'
										dark={false}
									>
										{"Remove page"}
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
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SimpleTextBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.TEXT, page);
								}}
							></SimpleTextBox>
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Graph components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<LevelBarGraphBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_BAR_GRAPH, page);
								}}
							></LevelBarGraphBox>
							<LevelPieGraphBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_PIE_GRAPH, page);
								}}
							></LevelPieGraphBox>
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Table components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SimpleTableBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.SIMPLE_TABLE, page);
								}}
							></SimpleTableBox>
							<CapabilityTableBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.CAPABILITY_TABLE, page);
								}}
							></CapabilityTableBox>
						</div>
					</SidebarDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default ReportMenu;
