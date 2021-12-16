import { Form, Formik } from "formik";
import Button from "../UI/Button";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import { typeEnum } from "./TemplateCreate";
import * as Yup from "yup";

const TemplateCanvasLeft = ({ data, onSave, onAddComponent }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-gray-300'>
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
					<CanvasPanelDisclosure name='Template settings'>
						<li>Editable</li>
						<li>Shared</li>
					</CanvasPanelDisclosure>
					<CanvasPanelDisclosure name='Template components'>
						<div
							className='p-2 m-2 bg-gray-200'
							onClick={() => onAddComponent(typeEnum.TEXT)}
						>
							TEXT
						</div>
						<div
							className='p-2 m-2 bg-gray-200'
							onClick={() => onAddComponent(typeEnum.GRAPH)}
						>
							GRAPH
						</div>
						<div
							className='p-2 m-2 bg-gray-200'
							onClick={() => onAddComponent(typeEnum.TABLE)}
						>
							TABLE
						</div>
					</CanvasPanelDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default TemplateCanvasLeft;
