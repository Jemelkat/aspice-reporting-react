import { useState } from "react";
import { useAlert } from "react-alert";
import { CapabilityTable, Item, typeEnum } from "../helpers/ClassHelper";

const useCanvas = () => {
	const alert = useAlert();
	const [items, setItems] = useState([]);
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
		setSelectedItem(updatedItem);
		setShowSelected(true);
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
		setSelectedItem(updatedItem);
		setShowSelected(true);
		setItems(newItems);
	};

	const selectItemHandler = (id) => {
		if (id === null) {
			setSelectedItem(null);
			setShowSelected(false);
		} else {
			setSelectedItem(items.find((i) => i.id === id));
			setShowSelected(true);
		}
	};

	const deleteItemHandler = (id) => {
		setShowSelected(false);
		setSelectedItem(null);
		setItems(items.filter((c) => c.id !== id));
	};

	const addItemHandler = (type) => {
		let item;
		switch (type) {
			case typeEnum.TEXT:
				item = new Item(nextItemId(), 0, 0, 150, 50, typeEnum.STATIC_TEXT);
				break;
			case typeEnum.GRAPH:
				item = new Item(nextItemId(), 0, 0, 200, 200, typeEnum.GRAPH);
				break;
			case typeEnum.SIMPLE_TABLE:
				item = new Item(nextItemId(), 0, 0, 350, 200, typeEnum.SIMPLE_TABLE);
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
			default:
				break;
		}
		const itemsArray = [...items, item];
		setItems(itemsArray);
	};

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

	const updateItemHandler = (item) => {
		//Find the item and replace
		const newItems = items.map((i) => (i.id === item.id ? item : i));
		const newSelected = newItems.find((i) => i.id === item.id);
		setItems(newItems);
		setSelectedItem(newSelected);
	};

	return {
		items,
		setItems,
		showSelected,
		selectedItem,
		moveItemHandler,
		resizeItemHandler,
		selectItemHandler,
		deleteItemHandler,
		addItemHandler,
		layerItemHandler,
		updateItemHandler,
	};
};

export default useCanvas;
