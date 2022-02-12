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
import { createItemFromExisting } from "../../helpers/ClassHelper";
const DashBoard = () => {
	const {
		items,
		setItems,
		selectedItem,
		setSelectedItem,
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

	//Changes selected item ID based on ID provided on save
	const updateIdsOnSaveHandler = (updatedItems, selectedIdIndex = -1) => {
		let newItems = [];
		if (items) {
			//Update ids of items - items are in same order as in DB
			items.forEach((item, index) => {
				const newItem = { ...item, id: updatedItems[index].id };
				newItems.push(createItemFromExisting(newItem));
			});
			setItems(newItems);
			if (selectedIdIndex !== -1) {
				setSelectedItem(newItems[selectedIdIndex]);
				return newItems[selectedIdIndex].id;
			} else {
				selectItemHandler(null);
				return null;
			}
		}
	};

	//Saves dashboard to DB
	const saveDashboardHandler = async (selectedId = null) => {
		//Find index on which the current selected ID is
		let index = -1;
		if (selectedId !== null) {
			index = items.findIndex((item) => item.id === selectedId);
			if (index === -1) {
				alert.error("Dashboard data integrity error.");
				throw new Error("Dashboard data integrity error.");
			}
		}
		//save
		try {
			const response = await saveDashboard(dashboardId, items);
			alert.info("Dashboard saved");
			return updateIdsOnSaveHandler(response.data.dashboardItems, index);
		} catch (e) {
			alert.error("Error saving dashboard.");
			throw e;
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
							onClose={() => selectItemHandler(null)}
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
