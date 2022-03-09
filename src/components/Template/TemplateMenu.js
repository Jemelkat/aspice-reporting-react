import { Field, Form, Formik } from "formik";
import Button from "../../ui/Button";
import SidebarDisclosure from "../../ui/Sidebar/SidebarDisclosure";
import FormHidden from "../../ui/Form/FormHidden";
import FormInput from "../../ui/Form/FormInput";
import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import * as Yup from "yup";
import { PlusIcon } from "@heroicons/react/solid";
import { typeEnum } from "../../helpers/ClassHelper";
import SidebarCanvasItem from "../../ui/Sidebar/SidebarCanvasItem";
import { ReactComponent as SVGBarHorizontal } from "../../assets/barchart-horizontal.svg";
import { ReactComponent as SVGPie } from "../../assets/piechart.svg";
import { ReactComponent as SVGSimpleTable } from "../../assets/simple-table.svg";
import { ReactComponent as SVGCapabilityTable } from "../../assets/capability-table.svg";
import FormSelect from "../../ui/Form/FormSelect";

const TemplateMenu = ({
	data,
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
								id: data ? data.id : null,
								orientation: data?.orientation ? data.orientation : "VERTICAL",
								templateName: data ? data.templateName : "",
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
								<Form className='flex flex-col p-4'>
									<FormHidden name='id'></FormHidden>
									<FormInput
										label='Template name'
										name='templateName'
										type='text'
										placeholder='Template name...'
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
								<SVGBarHorizontal></SVGBarHorizontal>
							</SidebarCanvasItem>
							<SidebarCanvasItem
								mini
								name={"Level pie"}
								onClick={() => {
									onAddComponent(typeEnum.LEVEL_PIE_GRAPH);
								}}
							>
								<SVGPie></SVGPie>
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

export default TemplateMenu;
