import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";

const TemplateGrid = () => {
	const layout = [
		{ i: "a", x: 0, y: 0, w: 1, h: 1 },
		{ i: "b", x: 11, y: 0, w: 10, h: 10 },
		{ i: "c", x: 4, y: 0, w: 10, h: 10 },
	];
	const [layouts, setLayouts] = useState(layout);
	let lastLayoutsThatRespectMaxHeight = [];
	const maxAllowedGridHeight = 500;

	function onLayoutChange(currentLayout) {
		console.log("New layout: ");
		console.log(currentLayout);
		setLayouts(currentLayout);
		resetOldLayoutIfNewHeightTooBig();
	}

	const resetOldLayoutIfNewHeightTooBig = () => {
		const newHeight = document.querySelector(".react-grid-layout").offsetHeight;
		console.log("New height: " + newHeight);
		if (newHeight > maxAllowedGridHeight) {
			console.log("Reseting layout");
			console.log(layouts);
			console.log("To last");
			console.log(lastLayoutsThatRespectMaxHeight);
			setLayouts(lastLayoutsThatRespectMaxHeight);
		}
	};

	const saveCurrentLayouts = (
		layout,
		oldItem,
		newItem,
		placeholder,
		e,
		element
	) => {
		console.log("Save current layout");
		lastLayoutsThatRespectMaxHeight = [...layouts];
		console.log(lastLayoutsThatRespectMaxHeight);
	};

	return (
		<>
			<div>
				{layouts.map((layout) => (
					<div>
						x:{layout.x} y:{layout.y} h:{layout.h} w:{layout.w}
					</div>
				))}
			</div>
			<div>
				<GridLayout
					className='layout bg-gray-300'
					layout={layouts}
					isBounded={true}
					cols={794}
					width={794}
					rowHeight={1}
					compactType={null}
					onResizeStart={saveCurrentLayouts}
					onDragStart={saveCurrentLayouts}
					onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
				>
					<div key='a' className='bg-gray-200'>
						a
					</div>
					<div key='b' className='bg-gray-200'>
						b
					</div>
				</GridLayout>
			</div>
		</>
	);
};

export default TemplateGrid;
