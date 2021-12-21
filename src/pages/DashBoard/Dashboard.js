import { Responsive, WidthProvider } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import SidebarLinks from "../../components/UI/Sidebar/SidebarLinks";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashBoard = (props) => {
	const layout = [
		{ i: "a", x: 0, y: 0, w: 100, h: 100 },
		{ i: "b", x: 500, y: 0, w: 10, h: 10 },
		{ i: "c", x: 4, y: 0, w: 10, h: 10 },
	];

	return (
		<>
			<div className='flex bg-gray-200'>
				<Sidebar className='sticky top-0'>
					<SidebarLinks sidebarName='Dashboard'></SidebarLinks>
				</Sidebar>
				<div className='flex flex-col w-full mt-5 mb-5 ml-10 mr-10 min-w-screen'>
					<button onClick={console.log("")}>Add Item</button>
					<ResponsiveGridLayout
						className='w-full min-h-screen bg-white border-2'
						layouts={layout}
						isDraggable
						isResizable
						breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
					>
						<div className='text-white bg-gray-800' key='a'>
							1
						</div>
						<div className='text-white bg-gray-800' key='b'>
							2
						</div>
						<div className='text-white bg-gray-800' key='c'>
							3
						</div>
					</ResponsiveGridLayout>
				</div>
			</div>
		</>
	);
};

export default DashBoard;
