import { Form, Formik } from "formik";
import Button from "../UI/Button";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { PlusIcon } from "@heroicons/react/solid";
import { typeEnum } from "../../helpers/ClassHelper";
import SidebarCanvasItem from "../UI/Sidebar/SidebarCanvasItem";
import { ReactComponent as SVGBarHorizontal } from "../../assets/barchart-horizontal.svg";
import { ReactComponent as SVGPie } from "../../assets/piechart.svg";
import { ReactComponent as SVGSimpleTable } from "../../assets/simple-table.svg";
import { ReactComponent as SVGCapabilityTable } from "../../assets/capability-table.svg";

const TemplateMenuLeft = ({ data, onSave, onAddComponent }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLinks sidebarName='Template'>
						<Formik
							enableReinitialize={true}
							initialValues={{
								id: data ? data.id : null,
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
							<Form className='flex flex-col p-4'>
								<FormHidden name='id'></FormHidden>
								<FormInput
									label='Template name'
									name='templateName'
									type='text'
									placeholder='Template name...'
								/>
								<Button dark={true} type='submit' className='mt-4'>
									Save
								</Button>
							</Form>
						</Formik>
					</SidebarLinks>
					<SidebarLinks sidebarName='Items'>
						<span className='w-full pt-2 pb-2 pl-5 pr-5 text-sm text-center'>
							Click on item to add it to template
						</span>
					</SidebarLinks>
					<CanvasPanelDisclosure name='Text components' dark>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => onAddComponent(typeEnum.TEXT)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							TEXT
						</div>
					</CanvasPanelDisclosure>
					<CanvasPanelDisclosure name='Graph components' dark>
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
					</CanvasPanelDisclosure>
					<CanvasPanelDisclosure name='Table components' dark>
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
					</CanvasPanelDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default TemplateMenuLeft;
