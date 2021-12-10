import Sidebar from "../../UI/Sidebar/Sidebar";
import SidebarLinks from "../../UI/Sidebar/SidebarLinks";

const ReportCreate = (props) => {
	return (
		<div className='flex'>
			{/*Left sidebar */}
			<div className='flex-1 mr-36'>
				<div className=' flex justify-end h-screen sticky top-0'>
					<Sidebar>
						<SidebarLinks sidebarName='Report components'></SidebarLinks>
					</Sidebar>
				</div>
			</div>
			{/*Canvas */}
			<div
				className='flex-none border-2 shadow-xl mt-12 mb-12'
				style={{ width: "210mm", height: "297mm" }}
			>
				CENTER
			</div>
			{/**Right sidebar */}
			<div className='flex-1 ml-36'>
				<div className=' flex justify-start h-screen sticky top-0'>
					<Sidebar>
						<SidebarLinks sidebarName='Edit selected component'></SidebarLinks>
					</Sidebar>
				</div>
			</div>
		</div>
	);
};

export default ReportCreate;
