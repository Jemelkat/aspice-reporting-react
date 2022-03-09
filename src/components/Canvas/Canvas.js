import CanvasItem from "./CanvasItem";

const Canvas = ({
	items,
	orientation = "VERTICAL",
	onMove,
	onResize,
	onSelect,
	selectedItem,
}) => {
	return (
		<div className='mt-4 mb-10 overflow-x-auto overflow-y-hidden border-2'>
			<div
				className='relative bg-white'
				style={
					orientation === "HORIZONTAL"
						? { width: "297mm", height: "210mm" }
						: { width: "210mm", height: "297mm" }
				}
				onClick={() => {
					onSelect(null);
				}}
			>
				{/*Generate stored components to canvas */}
				{items.map((i) => {
					return (
						<CanvasItem
							key={i.id}
							item={i}
							onMove={onMove}
							onResize={onResize}
							onSelect={onSelect}
							isSelected={selectedItem && selectedItem.id === i.id}
						></CanvasItem>
					);
				})}
			</div>
		</div>
	);
};

export default Canvas;
