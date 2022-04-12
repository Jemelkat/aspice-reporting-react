import Button from "../../ui/Button";
import Sidebar from "../../ui/Sidebar/Sidebar";
import SidebarLink from "../../ui/Sidebar/SidebarLink";
import { typeEnum } from "../../helpers/ClassHelper";
import LevelBarGraphBox from "../../ui/ItemMenuBox/LevelBarGraphBox";
import LevelPieGraphBox from "../../ui/ItemMenuBox/LevelPieGraphBox";

const DashboardMenu = ({ onSave, onAddComponent, currentColumns }) => {
	return (
		<div className='flex-1 mr-2 xl:mr-4'>
			<div className='sticky top-0 flex justify-start h-screen'>
				<Sidebar className='overflow-y-auto bg-white shadow-xl'>
					<SidebarLink sidebarName='Dashboard'>
						<div className='flex flex-col p-4 text-center'>
							Save dashboard to store changes.
							<Button dark className='mt-4' onClick={() => onSave()}>
								Save
							</Button>
						</div>
					</SidebarLink>
					<div className='flex items-center justify-center h-8 text-white bg-gray-800'>
						Dashboard items
					</div>
					<div className='flex flex-col items-center justify-center'>
						<span className='w-full pt-2 pb-2 pl-5 pr-5 text-sm text-center'>
							Click on item to add it to dashboard
						</span>
						<LevelBarGraphBox
							onClick={() => {
								onAddComponent(typeEnum.LEVEL_BAR_GRAPH, currentColumns);
							}}
						></LevelBarGraphBox>
						<LevelPieGraphBox
							onClick={() => {
								onAddComponent(typeEnum.LEVEL_PIE_GRAPH, currentColumns);
							}}
						></LevelPieGraphBox>
					</div>
				</Sidebar>
			</div>
		</div>
	);
};

export default DashboardMenu;
