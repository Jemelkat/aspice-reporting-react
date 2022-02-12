import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";
import { useEffect, useState } from "react";
import CanvasRightMenu from "../../components/Canvas/CanvasRightMenu";
import DashBoardMenu from "../../components/Dashboard/DashboardMenu";
import useCanvas from "../../hooks/useCanvas";
import { getDashboard, saveDashboard } from "../../services/DashboardService";
import { useAlert } from "react-alert";
import Loader from "../../components/UI/Loader/Loader";
import DashboardCanvas from "../../components/Dashboard/DashboardCanvas";
const DashBoard = () => {
	const {
		items,
		selectedItem,
		showSelected,
		hideSettings,
		addItemDashboardHandler,
		deleteItemHandler,
		selectItemHandler,
		updateItemHandler,
		resizeItemHandler,
		moveItemHandler,
		parseLoadedItems,
	} = useCanvas();
	const [currentColumns, setCurrentColumns] = useState(12);
	const [dashboardLoading, setDashboardLoading] = useState(true);
	const [dashboardId, setDashboardId] = useState(null);
	const alert = useAlert();

	const breakPointChangeHandler = (breakpoint, cols) => {
		setCurrentColumns(cols);
	};

	//Saves dashboard to DB
	const saveDashboardHandler = async () => {
		try {
			const response = await saveDashboard(dashboardId, items);
			//parseLoadedItems(response.data.dashboardItems);
			alert.info("Dashboard saved");
		} catch (e) {
			alert.error("Error saving dashboard.");
		}
	};

	useEffect(() => {
		setDashboardLoading(true);
		getDashboard()
			.then((response) => {
				parseLoadedItems(response.data.dashboardItems);
				setDashboardId(response.data.id);
				setDashboardLoading(false);
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

						<DashboardCanvas
							items={items}
							onSelectItem={selectItemHandler}
							onDeleteItem={deleteItemHandler}
							onMove={moveItemHandler}
							onSave={saveDashboardHandler}
							onResize={resizeItemHandler}
							onBreakpointChange={breakPointChangeHandler}
						></DashboardCanvas>

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
