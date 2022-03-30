import { useState } from "react";
import { useAlert } from "react-alert";
import {
	CapabilityTable,
	createItemFromExisting,
	LevelPieGraph,
	SimpleTable,
	SourceLevelBarGraph,
	Text,
	typeEnum,
} from "../helpers/ClassHelper";

const useCanvas = () => {
	const alert = useAlert();
	const [items, setItems] = useState([]);
	const [pieX, setPieX] = useState(0);
	const [barX, setBarX] = useState(0);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showSelected, setShowSelected] = useState(false);

	//Get next id for new component
	const nextItemId = () => {
		const itemArray = items;
		if (itemArray.length === 0) {
			return 0;
		} else {
			return (
				Math.max.apply(
					null,
					itemArray.map((item) => item.id)
				) + 1
			);
		}
	};

	//Change state list item x, y on each item move
	const moveItemHandler = (id, x, y) => {
		let updatedItem = items.find((i) => i.id === id);
		updatedItem.x = x;
		updatedItem.y = y;
		const newItems = items.map((i) => (i.id === id ? updatedItem : i));
		// setSelectedItem(updatedItem);
		// setShowSelected(true);
		setItems(newItems);
	};

	//Change height, width state of item on resize
	const resizeItemHandler = (id, x, y, height, width) => {
		let updatedItem = items.find((i) => i.id === id);
		updatedItem.x = x;
		updatedItem.y = y;
		updatedItem.height = height;
		updatedItem.width = width;
		const newItems = items.map((i) => (i.id === id ? updatedItem : i));
		// setSelectedItem(updatedItem);
		// setShowSelected(true);
		setItems(newItems);
	};

	//Select item from items list by id
	const selectItemHandler = (id) => {
		if (id === null) {
			setShowSelected(false);
			setSelectedItem(null);
		} else {
			setSelectedItem(items.find((i) => i.id === id));
			setShowSelected(true);
		}
	};

	//Delete item from items list by id
	const deleteItemHandler = (id) => {
		setShowSelected(false);
		setSelectedItem(null);
		setItems(items.filter((c) => c.id !== id));
	};

	//Add new item to list for report and template canvas
	const addItemHandler = (type) => {
		let item;
		switch (type) {
			case typeEnum.TEXT:
				item = new Text(nextItemId(), 0, 0, 150, 50, typeEnum.TEXT);
				break;
			case typeEnum.SOURCE_LEVEL_BAR_GRAPH:
				item = new SourceLevelBarGraph(
					nextItemId(),
					0,
					0,
					200,
					200,
					typeEnum.SOURCE_LEVEL_BAR_GRAPH
				);
				break;
			case typeEnum.SIMPLE_TABLE:
				item = new SimpleTable(
					nextItemId(),
					0,
					0,
					350,
					200,
					typeEnum.SIMPLE_TABLE
				);
				break;
			case typeEnum.CAPABILITY_TABLE:
				item = new CapabilityTable(
					nextItemId(),
					0,
					0,
					350,
					200,
					typeEnum.CAPABILITY_TABLE
				);
				break;
			case typeEnum.LEVEL_PIE_GRAPH:
				item = new LevelPieGraph(
					nextItemId(),
					0,
					0,
					200,
					200,
					typeEnum.LEVEL_PIE_GRAPH
				);
				break;
			default:
				break;
		}
		const itemsArray = [...items, item];
		setItems(itemsArray);
	};

	//Add new item to list for dashboard
	const addItemDashboardHandler = (type, currentColumns) => {
		let item;
		switch (type) {
			case typeEnum.SOURCE_LEVEL_BAR_GRAPH: {
				const newBarX =
					barX >= currentColumns ? 0 : barX + 6 > currentColumns ? 0 : barX;
				item = new SourceLevelBarGraph(
					nextItemId(),
					newBarX,
					Infinity,
					6,
					6,
					typeEnum.SOURCE_LEVEL_BAR_GRAPH
				);
				setBarX(newBarX + 6);
				break;
			}
			case typeEnum.LEVEL_PIE_GRAPH: {
				const newPieX =
					pieX >= currentColumns ? 0 : pieX + 4 > currentColumns ? 0 : pieX;
				item = new LevelPieGraph(
					nextItemId(),
					newPieX,
					Infinity,
					4,
					6,
					typeEnum.LEVEL_PIE_GRAPH
				);
				setPieX(newPieX + 4);
				break;
			}
			default:
				break;
		}
		const itemsArray = [...items, item];
		setItems(itemsArray);
	};

	//Change order of items in list - will be rendered on top or bottom off canvas
	const layerItemHandler = (id, to) => {
		const nextFirst = items.filter((item) => item.id === id);
		const nextItems = items.filter((item) => item.id !== id);
		//Check if item exists
		if (nextFirst.length !== 1) {
			alert.error("Canvas error - found multiple items with id " + id);
			return;
		}
		if (to === "top") {
			setItems([...nextItems, nextFirst[0]]);
		}
		if (to === "bottom") {
			setItems([nextFirst[0], ...nextItems]);
		}
	};

	//Update exosting item in items list
	const updateItemHandler = (item) => {
		//Find the item and replace
		const newItems = items.map((i) => (i.id === item.id ? item : i));
		const newSelected = newItems.find((i) => i.id === item.id);
		setItems(newItems);
		setSelectedItem(newSelected);
	};

	const parseLoadedItems = (items) => {
		let newItems = [];
		setItems([]);
		if (items) {
			newItems = items.map((i) => createItemFromExisting(i));
			setItems(newItems);
			selectItemHandler(null);
		}
	};

	//Fixes items position when orientation changes - items wont be outside of canvas
	const orientationHandler = (orientation) => {
		const DPI = window.devicePixelRatio * 96;
		const upscale = (297 * DPI) / 25.4 / ((210 * DPI) / 25.4);
		const downscale = (210 * DPI) / 25.4 / ((297 * DPI) / 25.4);
		let newItems = [];
		if (orientation === "VERTICAL") {
			items.map((i) => {
				i.width = parseInt(i.width * downscale);
				i.height = parseInt(i.height * upscale);
				i.x = parseInt(i.x * downscale);
				i.y = parseInt(i.y * upscale);
				newItems.push(i);
			});
		} else {
			items.map((i) => {
				i.width = parseInt(i.width * upscale);
				i.height = parseInt(i.height * downscale);
				i.x = parseInt(i.x * upscale);
				i.y = parseInt(i.y * downscale);
				newItems.push(i);
			});
		}
		setItems(newItems);
	};

	return {
		items,
		setItems,
		showSelected,
		setSelectedItem,
		selectedItem,
		moveItemHandler,
		resizeItemHandler,
		selectItemHandler,
		deleteItemHandler,
		addItemHandler,
		addItemDashboardHandler,
		layerItemHandler,
		updateItemHandler,
		parseLoadedItems,
		orientationHandler,
	};
};

export default useCanvas;
