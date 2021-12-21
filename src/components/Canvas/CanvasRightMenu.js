import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Button from "../UI/Button";
import { typeEnum } from "../Template/TemplateCreate";
import { useEffect } from "react";

const CanvasRightMenu = ({ selectedItem, show, ...props }) => {
	//Id used in hook to rerender
	const currentId = selectedItem ? selectedItem.itemId : null;

	const renderTypeInputs = () => {
		switch (selectedItem.type) {
			case typeEnum.STATIC_TEXT:
				return (
					<div>
						<Formik
							//TODO UPDATE TEXT FIELD ON CHANGE
							enableReinitialize={true}
							initialValues={{
								textArea:
									selectedItem && selectedItem.textArea
										? selectedItem.textArea
										: "",
							}}
						>
							{({ handleChange }) => (
								<Form className='flex flex-col p-4'>
									<label className='mt-2' htmlFor='template'>
										Text:
									</label>
									<Field
										style={{ minHeight: "10rem" }}
										as='textarea'
										name='textArea'
										className='border-2 border-gray-300'
										onChange={(e) => {
											handleChange(e);
											const newSelected = {
												...selectedItem,
												textArea: e.target.value,
											};
											props.onItemUpdate(newSelected);
										}}
									/>
								</Form>
							)}
						</Formik>
					</div>
				);
			case typeEnum.GRAPH:
				return <div>Graph input form</div>;
			case typeEnum.TABLE:
				return <div>Table input form</div>;
			default:
				return <div>Unknown item type. Cannot render input form.</div>;
		}
	};

	//TODO: figure out a better way to change textarea
	useEffect(() => {}, [currentId]);

	return (
		<div className='flex-1 ml-2 xl:ml-4'>
			<div className='sticky top-0 flex justify-end h-screen'>
				<Sidebar
					className='overflow-y-auto bg-white shadow-xl'
					position='right'
					show={show}
				>
					{selectedItem && (
						<>
							<SidebarLinks sidebarName='Edit selected component'></SidebarLinks>

							<Formik
								enableReinitialize={true}
								initialValues={
									selectedItem
										? {
												id: selectedItem.itemId,
												x: selectedItem.x,
												y: selectedItem.y,
												width: selectedItem.width,
												height: selectedItem.height,
												type: selectedItem.type,
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
											<FormInput
												label='Type:'
												name='type'
												type='text'
												disabled
											/>
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

							<SidebarLinks sidebarName='Component sources'>
								{renderTypeInputs()}
							</SidebarLinks>
						</>
					)}
				</Sidebar>
			</div>
		</div>
	);
};

export default CanvasRightMenu;
