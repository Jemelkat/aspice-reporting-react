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
import useCanvas from "../../hooks/useCanvas";

const DashboardMenu = ({ onSave, onAddComponent, currentColumns }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLinks sidebarName='Dashboard'>
						<div className='flex flex-col p-4'>
							Save current dashboard to DB
							<Button dark={true} type='submit' className='mt-4'>
								Save
							</Button>
						</div>
					</SidebarLinks>
					<CanvasPanelDisclosure name='Graph components'>
						<div
							className='flex flex-row p-2 m-2 bg-gray-100'
							onClick={() => {
								onAddComponent(typeEnum.CAPABILITY_BAR_GRAPH, currentColumns);
							}}
						>
							<PlusIcon className='w-5 h-5 mr-1'></PlusIcon>
							GRAPH
						</div>
					</CanvasPanelDisclosure>
				</Sidebar>
			</div>
		</div>
	);
};

export default DashboardMenu;
