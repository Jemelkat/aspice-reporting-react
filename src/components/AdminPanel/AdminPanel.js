import Sidebar from "../Sidebar/Sidebar";
import { FullScreenContext } from "../../context/FullScreenContext";
import { useContext, useEffect } from "react";
import SidebarLinks from "../Sidebar/SidebarLinks";
const AdminPanel = () => {
	const { enableFullScreen, disableFullScreen } = useContext(FullScreenContext);

	useEffect(() => {
		enableFullScreen();
		return () => {
			disableFullScreen();
		};
	}, []);

	return (
		<div className='flex'>
			<Sidebar>
				<SidebarLinks></SidebarLinks>
			</Sidebar>
			<div>TEST</div>
		</div>
	);
};

export default AdminPanel;
