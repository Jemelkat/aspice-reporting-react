import {Field, Form, Formik} from "formik";
import Button from "../../ui/Button";
import SidebarDisclosure from "../../ui/Sidebar/SidebarDisclosure";
import FormHidden from "../../ui/Form/FormHidden";
import FormInput from "../../ui/Form/FormInput";
import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import * as Yup from "yup";
import {typeEnum} from "../../helpers/ClassHelper";
import FormSelect from "../../ui/Form/FormSelect";
import CapabilityTableBox from "../../ui/ItemMenuBox/CapabilityTableBox";
import SimpleTextBox from "../../ui/ItemMenuBox/SimpleTextBox";
import LevelBarGraphBox from "../../ui/ItemMenuBox/LevelBarGraphBox";
import SimpleTableBox from "../../ui/ItemMenuBox/SimpleTableBox";
import LevelPieGraphBox from "../../ui/ItemMenuBox/LevelPieGraphBox";

const TemplateMenu = ({
	id,
	name,
	onSetName,
	orientation,
	onOrientationChange,
	onSave,
	onAddComponent,
	isProcessing,
}) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLink sidebarName='Template'>
						<Formik
							enableReinitialize={true}
							initialValues={{
								id: id,
								orientation: orientation,
								templateName: name,
							}}
							validationSchema={Yup.object({
								templateName: Yup.string().required("Required"),
							})}
							onSubmit={(values, { setSubmitting }) => {
								onSave(values);
								setSubmitting(false);
							}}
						>
							{({ values }) => (
								<Form className='flex flex-col pb-4'>
									<FormHidden name='id'></FormHidden>
									<FormInput
										label='Template name'
										name='templateName'
										type='text'
										placeholder='Template name...'
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
									<Button
										dark={true}
										type={!isProcessing && "submit"}
										className='mt-4'
									>
										Save
									</Button>
								</Form>
							)}
						</Formik>
					</SidebarLink>
					<SidebarLink sidebarName='Items'>
						<span className='w-full pt-2 pb-2 pl-5 pr-5 text-sm text-center'>
							Click on item to add it to template
						</span>
					</SidebarLink>
					<SidebarDisclosure name='Text components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SimpleTextBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.TEXT);
								}}
							></SimpleTextBox>
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Graph components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<LevelBarGraphBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_BAR_GRAPH);
								}}
							></LevelBarGraphBox>
							<LevelPieGraphBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_PIE_GRAPH);
								}}
							></LevelPieGraphBox>
						</div>
					</SidebarDisclosure>
					<SidebarDisclosure name='Table components' dark>
						<div className='grid grid-cols-2 pt-4 mr-auto justify-items-center'>
							<SimpleTableBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.SIMPLE_TABLE);
								}}
							></SimpleTableBox>
							<CapabilityTableBox
								mini
								onClick={() => {
									onAddComponent(typeEnum.CAPABILITY_TABLE);
								}}
							></CapabilityTableBox>
						</div>
					</SidebarDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default TemplateMenu;
