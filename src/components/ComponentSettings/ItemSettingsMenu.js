import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import { Form, Formik } from "formik";
import FormHidden from "../../ui/Form/FormHidden";
import FormInput from "../../ui/Form/FormInput";
import Button from "../../ui/Button";
import { useEffect, useRef } from "react";
import { typeEnum } from "../../helpers/ClassHelper";
import SidebarDisclosure from "../../ui/Sidebar/SidebarDisclosure";
import TextSettings from "./Text/TextSettings";
import LevelPieGraphSettings from "./Graph/LevelPieGraphSettings";
import CapabilityTableSettigs from "./Table/CapabilityTableSettings";
import SimpleTableSettings from "./Table/SimpleTableSettings";
import LevelBarGraphSettings from "./Graph/LevelBarGraphSettings";

const ItemSettingsMenu = ({
	simple = false,
	page = 0,
	selectedItem,
	show,
	onItemUpdate,
	onClose,
	...props
}) => {
	//Id used in hook to rerender
	const currentId = selectedItem ? selectedItem.id : null;
	const formRef = useRef();

	const renderTypeInputs = () => {
		debugger;
		switch (selectedItem.type) {
			case typeEnum.TEXT:
				return (
					<TextSettings
						page={page}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></TextSettings>
				);
			case typeEnum.LEVEL_BAR_GRAPH:
				return (
					<LevelBarGraphSettings
						page={page}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></LevelBarGraphSettings>
				);
			case typeEnum.LEVEL_PIE_GRAPH:
				return (
					<LevelPieGraphSettings
						page={page}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></LevelPieGraphSettings>
				);
			case typeEnum.SIMPLE_TABLE:
				return (
					<SimpleTableSettings
						page={page}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></SimpleTableSettings>
				);
			case typeEnum.CAPABILITY_TABLE:
				return (
					<CapabilityTableSettigs
						page={page}
						selectedItem={selectedItem}
						onItemUpdate={onItemUpdate}
					></CapabilityTableSettigs>
				);

			default:
				return <div>Unknown item type. Cannot render settings form.</div>;
		}
	};

	useEffect(() => {}, [currentId]);

	return (
		<div className='flex-1 ml-2 xl:ml-4'>
			<div className='sticky top-0 flex justify-end h-screen'>
				<Sidebar
					className='overflow-y-auto bg-white shadow-xl'
					position='right'
					show={show}
				>
					<span
						class='font-extrabold border-1 drop-shadow-l absolute top-1 left-1 cursor-pointer'
						onClick={() => onClose()}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-6 h-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</span>
					{selectedItem && (
						<>
							<SidebarLink sidebarName='Edit component'></SidebarLink>
							{!simple && (
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
											  }
											: {
													id: "",
													x: "",
													y: "",
													width: "",
													height: "",
											  }
									}
								>
									{({ values }) => (
										<Form className='flex flex-col'>
											<SidebarDisclosure name='Basic information'>
												<FormHidden name='id'></FormHidden>
												<div className='grid grid-cols-2 p-4 gap-y-2'>
													<FormInput
														label='X:'
														name='x'
														type='number'
														disabled
													/>
													<FormInput
														label='Y:'
														name='y'
														type='number'
														disabled
													/>
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
														onClick={() =>
															props.onLayerChange(values.id, "top")
														}
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
											</SidebarDisclosure>
										</Form>
									)}
								</Formik>
							)}
							{renderTypeInputs()}
							<div className='flex flex-col justify-center pb-4 pl-4 pr-4 mt-4 border-t-2'>
								<Button
									type='button'
									dark
									className='mt-2 bg-gray-300 hover:bg-gray-400'
									onClick={() => {
										props.onDeleteItem(selectedItem.id, page);
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

export default ItemSettingsMenu;
