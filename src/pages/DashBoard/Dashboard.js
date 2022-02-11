import { Responsive } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import SidebarLinks from "../../components/UI/Sidebar/SidebarLinks";
import { useEffect, useMemo, useState } from "react";
import CanvasRightMenu from "../../components/Canvas/CanvasRightMenu";
import DashBoardMenu from "../../components/Dashboard/DashboardMenu";
import { SizeMe } from "react-sizeme";
import useCanvas from "../../hooks/useCanvas";
import { createItemFromExisting, typeEnum } from "../../helpers/ClassHelper";
import { PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { getFromLS, saveToLS } from "../../services/LocalStorageService";
import { getDashboard, saveDashboard } from "../../services/DashboardService";
import { useAlert } from "react-alert";
import Loader from "../../components/UI/Loader/Loader";

const DashBoard = (props) => {
	const {
		items,
		setItems,
		selectedItem,
		showSelected,
		hideSettings,
		addItemDashboardHandler,
		deleteItemHandler,
		selectItemHandler,
		updateItemHandler,
		resizeItemHandler,
		moveItemHandler,
	} = useCanvas();
	const [currentColumns, setCurrentColumns] = useState(12);

	const getLayouts = (key) => {
		let LSLayouts = getFromLS(key);
		try {
			LSLayouts = JSON.parse(LSLayouts) || {};
		} catch (e) {}
	};
	const [layouts, setLayouts] = useState(
		JSON.parse(JSON.stringify(getLayouts("rgl-8") || {}))
	);
	const [dashboardLoading, setDashboardLoading] = useState(true);
	const alert = useAlert();

	const onLayoutChange = (layout, layouts) => {
		saveLayout("rgl-8", layouts);
		setLayouts(layouts);
	};

	const onBreakpointChange = (breakpoint, cols) => {
		setCurrentColumns(cols);
	};

	const saveLayout = (key, value) => {
		saveToLS(
			key,
			JSON.stringify({
				["layouts"]: value,
			})
		);
	};

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
								e.preventDefault();
							}}
							className='absolute w-5 h-5 bg-gray-800 cursor-pointer top-1 right-7'
						></PencilIcon>
						<span
							class='z-0 border-1 drop-shadow-l absolute top-1 right-1 bg-gray-800  cursor-pointer '
							onClick={(e) => {
								selectItemHandler(null);
								deleteItemHandler(el.id);
								e.stopPropagation();
								e.preventDefault();
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

	const parseAndSetComponents = (components) => {
		let newComponents = [];
		setItems([]);
		if (components) {
			newComponents = components.map((i) => createItemFromExisting(i));
			setItems(newComponents);
			selectItemHandler(null);
		}
	};

	//Saves template to DB
	const saveDashboardHandler = async (formValues) => {
		try {
			debugger;
			const response = await saveDashboard(formValues, items);
			parseAndSetComponents(response.data.dashboardItems);
			alert.info("Dashboard saved");
		} catch (e) {
			alert.error("Error saving dashboard.");
		}
	};

	useEffect(() => {
		setDashboardLoading(true);
		getDashboard()
			.then((response) => {
				parseAndSetComponents(response.data.dashboardItems);
				setDashboardLoading(false);
				alert.info("Dashboard loaded.");
			})
			.catch(() => {
				setDashboardLoading(false);
				alert.error("Error getting dashboard data.");
			});
	}, []);

	return (
		<>
			<div className='flex bg-gray-200'>
				{dashboardLoading ? (
					<div className='items-center justify-center w-full h-screen-header'>
						<Loader>Loading dashboard data...</Loader>
					</div>
				) : (
					<>
						<DashBoardMenu
							onAddComponent={addItemDashboardHandler}
							currentColumns={currentColumns}
							onSave={saveDashboardHandler}
						></DashBoardMenu>

						<div className='w-full pt-5'>
							<SizeMe>
								{({ size }) => (
									<Responsive
										width={size.width}
										className='w-full min-h-screen bg-white border-2'
										breakpoints={{ xs: 480, xxs: 0 }}
										cols={{ xs: 12, xxs: 1 }}
										rowHeight={30}
										layouts={layouts}
										onLayoutChange={onLayoutChange}
										onBreakpointChange={onBreakpointChange}
										onResizeStop={(layout, oldItem, newItem) =>
											resizeItemHandler(
												parseInt(newItem.i),
												newItem.x,
												newItem.y,
												newItem.h,
												newItem.w
											)
										}
										onDragStop={(layout, oldItem, newItem) =>
											moveItemHandler(parseInt(newItem.i), newItem.x, newItem.y)
										}
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
					</>
				)}
			</div>
		</>
	);
};

export default DashBoard;
