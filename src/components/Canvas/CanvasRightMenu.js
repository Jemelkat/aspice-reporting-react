import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import { Field, Form, Formik } from "formik";
import FormHidden from "../UI/Form/FormHidden";
import FormInput from "../UI/Form/FormInput";
import Button from "../UI/Button";
import { useEffect } from "react";
import { typeEnum } from "../../helpers/ClassHelper";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import TextSettings from "../ComponentSettings/Text/TextSettings";
import { useRef } from "react";
import TableSettings from "../ComponentSettings/Table/TableSettings";
import CapabilityBarGraphSettings from "../ComponentSettings/Graph/CapabilityBarGraphSettings";

const CanvasRightMenu = ({ selectedItem, show, onItemUpdate, ...props }) => {
	//Id used in hook to rerender
	const currentId = selectedItem ? selectedItem.itemId : null;
	const formRef = useRef();

	const renderTypeInputs = () => {
		switch (selectedItem.type) {
			case typeEnum.TEXT:
				return (
					<TextSettings
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></TextSettings>
				);
			case typeEnum.CAPABILITY_BAR_GRAPH:
				return (
					<CapabilityBarGraphSettings
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></CapabilityBarGraphSettings>
				);
			case typeEnum.SIMPLE_TABLE:
				return (
					<TableSettings
						simple
						sourceId={
							selectedItem.source && selectedItem.source.id
								? selectedItem.source.id
								: null
						}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></TableSettings>
				);
			case typeEnum.CAPABILITY_TABLE:
				return (
					<TableSettings
						sourceId={
							selectedItem.source && selectedItem.source.id
								? selectedItem.source.id
								: null
						}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></TableSettings>
				);
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
							<SidebarLinks sidebarName='Edit component'></SidebarLinks>

							<Formik
								enableReinitialize={true}
								innerRef={formRef}
								initialValues={
									selectedItem
										? {
												id: selectedItem.id,
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
									<Form className='flex flex-col'>
										<CanvasPanelDisclosure name='Basic information'>
											<FormHidden name='id'></FormHidden>
											<div className='grid grid-cols-2 p-4 gap-y-2'>
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
											<div className='flex flex-col justify-center p-4'>
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
													onClick={() =>
														props.onLayerChange(values.id, "bottom")
													}
												>
													Move to Bottom
												</Button>
											</div>
										</CanvasPanelDisclosure>
									</Form>
								)}
							</Formik>
							{renderTypeInputs()}
							<div className='flex flex-col justify-center pb-4 pl-4 pr-4 mt-4 border-t-2'>
								<Button
									type='button'
									dark
									className='mt-2 bg-gray-300 hover:bg-gray-400'
									onClick={() => {
										props.onDeleteItem(formRef.current.values.id);
									}}
								>
									Remove item
								</Button>
							</div>
						</>
					)}
				</Sidebar>
			</div>
		</div>
	);
};

export default CanvasRightMenu;
