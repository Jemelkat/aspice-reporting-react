import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashBoard = (props) => {
	const layout = [
		{ i: "a", x: 0, y: 0, w: 1, h: 1 },
		{ i: "b", x: 11, y: 0, w: 10, h: 10 },
		{ i: "c", x: 4, y: 0, w: 10, h: 10 },
	];

	return (
		<>
			<div>
				<button onClick={console.log("")}>Add Item</button>
				<ResponsiveGridLayout
					className='border-2 layout'
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
		</>
	);
};

export default DashBoard;
