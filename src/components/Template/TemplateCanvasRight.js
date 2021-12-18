import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Button from "../UI/Button";
import { typeEnum } from "./TemplateCreate";

const TemplateCanvasRight = ({ selectedComponent, show, ...props }) => {
	const renderTypeInputs = () => {
		switch (selectedComponent.type) {
			case typeEnum.STATIC_TEXT:
				return <div>Static text input form</div>;
			case typeEnum.GRAPH:
				return <div>Graph input form</div>;
			case typeEnum.TABLE:
				return <div>Table input form</div>;
			default:
				return <div>Unknown item type. Cannot render input form.</div>;
		}
	};

	return (
		<div className='flex-1 ml-2 xl:ml-4'>
			<div className='sticky top-0 flex justify-end h-screen'>
				<Sidebar
					className='overflow-y-auto bg-gray-200 shadow-xl'
					position='right'
					show={show}
				>
					<SidebarLinks sidebarName='Edit selected component'></SidebarLinks>

					<Formik
						enableReinitialize={true}
						initialValues={
							selectedComponent
								? {
										id: selectedComponent.itemId,
										x: selectedComponent.x,
										y: selectedComponent.y,
										width: selectedComponent.width,
										height: selectedComponent.height,
										type: selectedComponent.type,
								  }
								: {
										id: "",
										x: "",
										y: "",
										width: "",
										height: "",
										type: "",
								  }
						}
					>
						{({ values }) => (
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
								<Button
									type='button'
									className='mt-2 bg-gray-300 hover:bg-gray-400'
									onClick={() => props.onLayerChange(values.id, "top")}
								>
									Move to Top
								</Button>
								<Button
									type='button'
									className='mt-2 bg-gray-300 hover:bg-gray-400'
									onClick={() => props.onLayerChange(values.id, "bottom")}
								>
									Move to Bottom
								</Button>
								<Button
									type='button'
									dark
									className='mt-2 bg-gray-300 hover:bg-gray-400'
									onClick={() => props.onDeleteItem(values.id)}
								>
									Remove item
								</Button>
							</Form>
						)}
					</Formik>

					<SidebarLinks sidebarName='Component sources'></SidebarLinks>
					<div>{selectedComponent && renderTypeInputs()}</div>
				</Sidebar>
			</div>
		</div>
	);
};

export default TemplateCanvasRight;
