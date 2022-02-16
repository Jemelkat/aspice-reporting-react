import Button from "../UI/Button";
import Sidebar from "../UI/Sidebar/Sidebar";
import SidebarLinks from "../UI/Sidebar/SidebarLinks";
import { typeEnum } from "../../helpers/ClassHelper";
import SidebarCanvasItem from "../UI/Sidebar/SidebarCanvasItem";
import { ReactComponent as SVGBarHorizontal } from "../../assets/barchart-horizontal.svg";
import { ReactComponent as SVGPie } from "../../assets/piechart.svg";

const DashboardMenu = ({ onSave, onAddComponent, currentColumns }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLinks sidebarName='Dashboard'>
						<div className='flex flex-col p-4'>
							<Button dark className='mt-4' onClick={() => onSave()}>
								Save
							</Button>
						</div>
					</SidebarLinks>
					<div className='flex items-center justify-center h-8 text-white bg-gray-800'>
						Dashboard items
					</div>
					<div className='flex flex-col items-center justify-center'>
						<span className='w-full pt-2 pb-2 pl-5 pr-5 text-sm text-center'>
							Click on item to add it to dashboard
						</span>
						<SidebarCanvasItem
							name={"Capability bar graph"}
							onClick={() => {
								onAddComponent(typeEnum.CAPABILITY_BAR_GRAPH, currentColumns);
							}}
						>
							<SVGBarHorizontal></SVGBarHorizontal>
						</SidebarCanvasItem>
						<SidebarCanvasItem
							name={"Level pie graph"}
							onClick={() => {
								onAddComponent(typeEnum.LEVEL_PIE_GRAPH, currentColumns);
							}}
						>
							<SVGPie></SVGPie>
						</SidebarCanvasItem>
					</div>
				</Sidebar>
			</div>
		</div>
	);
};

export default DashboardMenu;
