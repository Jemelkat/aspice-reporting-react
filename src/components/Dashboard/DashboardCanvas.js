import { useState } from "react";
import { Responsive } from "react-grid-layout";
import { SizeMe } from "react-sizeme";
import { getFromLS, saveToLS } from "../../services/LocalStorageService";
import DashboardItem from "./DashboardItem";

const DashboardCanvas = ({
	items,
	onResize,
	onMove,
	onSave,
	onBreakpointChange,
	onSelectItem,
	onDeleteItem,
}) => {
	const getLayouts = (key) => {
		let LSLayouts = getFromLS(key);
		try {
			LSLayouts = JSON.parse(LSLayouts) || {};
		} catch (e) {}
	};
	const saveLayout = (key, value) => {
		saveToLS(
			key,
			JSON.stringify({
				["layouts"]: value,
			})
		);
	};
	const [layouts, setLayouts] = useState(
		JSON.parse(JSON.stringify(getLayouts("rgl-8") || {}))
	);

	const layoutChangeHandler = (layout, layouts) => {
		saveLayout("rgl-8", layouts);
		setLayouts(layouts);
	};

	const createDashboardItem = (el) => {
		let { height: h, width: w, ...rest } = el;
		el = { h, w, ...rest };
		return (
			<div
				key={el.id}
				data-grid={el}
				className='bg-gray-100 rounded-md shadow-md'
			>
				<DashboardItem
					key={el.id}
					item={el}
					onSelectItem={onSelectItem}
					onDeleteItem={onDeleteItem}
					onSave={onSave}
				></DashboardItem>
			</div>
		);
	};

	return (
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
						onLayoutChange={layoutChangeHandler}
						onBreakpointChange={onBreakpointChange}
						onResizeStop={(layout, oldItem, newItem) =>
							onResize(
								parseInt(newItem.i),
								newItem.x,
								newItem.y,
								newItem.h,
								newItem.w
							)
						}
						onDragStop={(layout, oldItem, newItem) =>
							onMove(parseInt(newItem.i), newItem.x, newItem.y)
						}
					>
						{items.map((i) => createDashboardItem(i))}
					</Responsive>
				)}
			</SizeMe>
		</div>
	);
};

export default DashboardCanvas;
