import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../..//node_modules/react-resizable/css/styles.css";
import { useEffect, useState } from "react";
import ItemSettingsMenu from "../../components/ComponentSettings/ItemSettingsMenu";
import DashBoardMenu from "../../components/Dashboard/DashboardMenu";
import useCanvas from "../../hooks/useCanvas";
import { useAlert } from "react-alert";
import Loader from "../../ui/Loader/Loader";
import DashboardCanvas from "../../components/Dashboard/DashboardCanvas";
import ExportItemDialog from "../../components/Dashboard/ExportItemDialog";
import DashboardService from "../../services/DashboardService";

const DashBoard = () => {
	const {
		items,
		setItems,
		selectedItem,
		showSelected,
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
	const [showExportDialog, setShowExportDialog] = useState(false);
	const alert = useAlert();

	const breakPointChangeHandler = (breakpoint, cols) => {
		setCurrentColumns(cols);
	};

	//Changes selected item ID based on ID provided on save
	const updateIdsOnSaveHandler = (updatedItems, selectedIdIndex = -1) => {
		debugger;
		if (updatedItems.length > 0) {
			let newItems = items[0];
			newItems = newItems.slice(0, updatedItems.length);
			for (let i = 0; i < newItems.length; i++) {
				//Clean object but keep reference - needed for useEffect hook
				for (var variableKey in newItems[i]) {
					if (newItems[i].hasOwnProperty(variableKey)) {
						delete newItems[i][variableKey];
					}
				}
				newItems[i] = Object.assign(newItems[i], updatedItems[i]);
			}
			let selectedItem = null;
			if (selectedIdIndex !== -1) {
				selectedItem = updatedItems[selectedIdIndex];
			}
			setItems([newItems]);
			return selectedItem;
		}
	};

	//Saves dashboard to DB
	const saveDashboardHandler = async (selectedId = null) => {
		//save
		try {
			//Find index on which the requested item ID is
			let index = -1;
			if (selectedId !== null) {
				index = items[0].findIndex((item) => item.id === selectedId);
				if (index === -1) {
					alert.error("Dashboard data integrity error.");
					throw new Error("Dashboard data integrity error.");
				}
			}
			const response = await DashboardService.saveDashboard(
				dashboardId,
				items[0]
			);
			alert.info("Dashboard saved");
			return updateIdsOnSaveHandler(response.data.dashboardItems, index);
		} catch (e) {
			alert.error("Error saving dashboard.");
			throw e;
		}
	};

	useEffect(() => {
		setDashboardLoading(true);
		DashboardService.getDashboard()
			.then((response) => {
				if (response.data) {
					parseLoadedItems(response.data.dashboardItems);
					setDashboardId(response.data.id);
				}
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
							items={items[0]}
							onSelectItem={selectItemHandler}
							onDeleteItem={deleteItemHandler}
							onMove={moveItemHandler}
							onSave={saveDashboardHandler}
							onResize={resizeItemHandler}
							onBreakpointChange={breakPointChangeHandler}
							onExport={() => setShowExportDialog(true)}
							selectedItem={selectedItem}
						></DashboardCanvas>

						<ItemSettingsMenu
							simple
							show={showSelected}
							onClose={() => selectItemHandler(null)}
							selectedItem={selectedItem}
							onDeleteItem={deleteItemHandler}
							onItemUpdate={updateItemHandler}
						></ItemSettingsMenu>

						{showExportDialog && (
							<ExportItemDialog
								item={selectedItem}
								showDialog={showExportDialog}
								onClose={() => setShowExportDialog(false)}
							></ExportItemDialog>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default DashBoard;
