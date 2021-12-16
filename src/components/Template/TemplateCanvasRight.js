import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Button from "../UI/Button";

const TemplateCanvasRight = ({ selectedComponent, formChangeHandler }) => {
	return (
		<div className='flex-1 ml-2 xl:ml-4'>
			<div className='sticky top-0 flex justify-end h-screen'>
				{selectedComponent && (
					<Sidebar className='bg-gray-300'>
						<SidebarLinks sidebarName='Edit selected component'></SidebarLinks>

						<Formik
							enableReinitialize={true}
							initialValues={{
								id: selectedComponent.itemId,
								x: selectedComponent.x,
								y: selectedComponent.y,
								width: selectedComponent.width,
								height: selectedComponent.height,
								type: selectedComponent.type,
							}}
							onSubmit={(values, { setSubmitting }) => {
								console.log(values);
								setSubmitting(false);
							}}
						>
							{({ handleChange, handleBlur, values }) => (
								<Form className='flex flex-col p-4'>
									<FormHidden name='id'></FormHidden>
									<div className='grid grid-cols-2 gap-y-2'>
										<FormInput label='Type:' name='type' type='text' disabled />
										<FormInput label='X:' name='x' type='number' disabled />
										<FormInput label='Y:' name='y' type='number' disabled />
										<FormInput
											label='Width:'
											name='width'
											type='number'
											disabled
										/>
										<FormInput
											label='Height:'
											name='height'
											type='number'
											disabled
										/>
									</div>
								</Form>
							)}
						</Formik>

						<SidebarLinks sidebarName='Component sources'></SidebarLinks>
					</Sidebar>
				)}
			</div>
		</div>
	);
};

export default TemplateCanvasRight;
