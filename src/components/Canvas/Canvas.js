import CanvasItem from "./CanvasItem";

const Canvas = ({ items, onMove, onResize, onSelect, selectedItem }) => {
	return (
		<div className='mt-4 mb-10 overflow-x-auto overflow-y-hidden border-2'>
			<div
				className='relative bg-white'
				style={{ width: "210mm", height: "297mm" }}
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
