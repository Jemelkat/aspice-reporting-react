import { Form, Formik } from "formik";
import Button from "../UI/Button";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import { typeEnum } from "./TemplateCreate";
import * as Yup from "yup";
import { PlusIcon } from "@heroicons/react/solid";

const TemplateCanvasLeft = ({ data, onSave, onAddComponent }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-gray-200 shadow-xl'>
					<SidebarLinks sidebarName='Template'>
						<Formik
							initialValues={{
								id: data ? data.templateId : null,
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
					<CanvasPanelDisclosure
						name='Template settings'
						className='bg-red-200'
					>
						<div>Editable</div>
						<span>Shared</span>
					</CanvasPanelDisclosure>
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
							onClick={() => onAddComponent(typeEnum.TABLE)}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							TABLE
						</div>
					</CanvasPanelDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default TemplateCanvasLeft;
