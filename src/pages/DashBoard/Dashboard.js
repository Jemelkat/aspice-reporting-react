import { Responsive, WidthProvider } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import SidebarLinks from "../../components/UI/Sidebar/SidebarLinks";
import { useMemo, useState } from "react";
import CanvasRightMenu from "../../components/Canvas/CanvasRightMenu";
import DashBoardMenu from "../../components/Dashboard/DashboardMenu";
import { SizeMe } from "react-sizeme";
import useCanvas from "../../hooks/useCanvas";
import { typeEnum } from "../../helpers/ClassHelper";
import { PencilAltIcon, PencilIcon } from "@heroicons/react/solid";

const DashBoard = (props) => {
	const {
		items,
		selectedItem,
		showSelected,
		hideSettings,
		addItemDashboardHandler,
		deleteItemHandler,
		selectItemHandler,
		updateItemHandler,
	} = useCanvas();
	const originalLayouts = getFromLS("layouts") || {};
	const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
	const [currentColumns, setCurrentColumns] = useState(12);
	const [layouts, setLayouts] = useState(
		JSON.parse(JSON.stringify(originalLayouts))
	);

	const stringifyLayout = () => {
		return layouts[currentBreakpoint].map(function (l) {
			return (
				<div className='layoutItem' key={l.i}>
					<b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]
				</div>
			);
		});
	};

	const onLayoutChange = (layout, layouts) => {
		debugger;
		saveToLS("layouts", layouts);
		setLayouts(layouts);
	};

	const onBreakpointChange = (breakpoint, cols) => {
		debugger;
		setCurrentBreakpoint(breakpoint);
		setCurrentColumns(cols);
	};

	function getFromLS(key) {
		let ls = {};
		if (global.localStorage) {
			try {
				ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
			} catch (e) {
				/*Ignore*/
			}
		}
		return ls[key];
	}

	function saveToLS(key, value) {
		if (global.localStorage) {
			global.localStorage.setItem(
				"rgl-8",
				JSON.stringify({
					[key]: value,
				})
			);
		}
	}

	const createElement = (el) => {
		const removeStyle = {
			position: "absolute",
			right: "2px",
			top: 0,
			cursor: "pointer",
		};
		let { height: h, width: w, ...rest } = el;
		el = { h, w, ...rest };
		return (
			<div
				key={el.id}
				data-grid={el}
				className='bg-gray-100 rounded-md shadow-md'
			>
				<div className='w-full text-white bg-gray-800 h-7'>
					<div className='pl-1 mr-10 overflow-hidden'>{el.type}</div>
					<span>
						<PencilIcon
							onClick={(e) => {
								selectItemHandler(el.id);
								e.stopPropagation();
							}}
							className='absolute w-5 h-5 bg-gray-800 cursor-pointer top-1 right-7'
						></PencilIcon>
						<span
							class='z-0 border-1 drop-shadow-l absolute top-1 right-1 bg-gray-800  cursor-pointer '
							onClick={(e) => {
								selectItemHandler(null);
								deleteItemHandler(el.id);
								e.stopPropagation();
							}}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5'
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
					</span>
				</div>
				<div
					className='h-auto bg-gray-200'
					onClick={() => {
						selectItemHandler(el.id);
					}}
				></div>
			</div>
		);
	};

	return (
		<>
			<div className='flex bg-gray-200'>
				<DashBoardMenu
					onAddComponent={addItemDashboardHandler}
					currentColumns={currentColumns}
				></DashBoardMenu>

				<div className='w-full pt-5'>
					<SizeMe>
						{({ size }) => (
							<Responsive
								width={size.width}
								className='w-full min-h-screen bg-white border-2'
								breakpoints={{ lg: 1200, sm: 768, xs: 480, xxs: 0 }}
								cols={{ lg: 12, sm: 6, xs: 4, xxs: 1 }}
								rowHeight={30}
								layouts={layouts}
								onLayoutChange={onLayoutChange}
								onBreakpointChange={onBreakpointChange}
							>
								{items.map((el) => createElement(el))}
							</Responsive>
						)}
					</SizeMe>
				</div>

				<CanvasRightMenu
					simple
					show={showSelected}
					onClose={hideSettings}
					selectedItem={selectedItem}
					onDeleteItem={deleteItemHandler}
					onItemUpdate={updateItemHandler}
				></CanvasRightMenu>
			</div>
		</>
	);
};

export default DashBoard;
