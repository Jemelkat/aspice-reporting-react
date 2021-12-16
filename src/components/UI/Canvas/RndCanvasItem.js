import { Rnd } from "react-rnd";
import { useState } from "react";

const RndCanvasItem = (props) => {
	const [item, setItem] = useState({
		id: props.item.itemId,
		x: props.item.x,
		y: props.item.y,
		width: props.item.width,
		height: props.item.height,
		type: props.item.type,
	});

	return (
		<Rnd
			default={{
				x: props.item.x,
				y: props.item.y,
				width: props.item.width,
				height: props.item.height,
			}}
			dragGrid={[5, 5]}
			resizeGrid={[5, 5]}
			bounds='parent'
			onResize={(e, direction, ref, delta, position) => {
				const x = position.x < 0 ? 0 : position.x;
				const y = position.y < 0 ? 0 : position.y;
				setItem({
					...item,
					x: x,
					y: y,
					height: ref.offsetHeight,
					width: ref.offsetWidth,
				});
				props.onResize(item.id, x, y, ref.offsetHeight, ref.offsetWidth);
			}}
			onDragStop={(event, data) => {
				//Prevent -x and -y
				const x = data.x < 0 ? 0 : data.x;
				const y = data.y < 0 ? 0 : data.y;
				setItem({ ...item, x: x, y: y });
				props.onMove(item.id, x, y);
			}}
			onClick={() => props.onSelect(item.id)}
		>
			<div className='flex items-center justify-center w-full h-full bg-gray-100 border-2 border-gray-300 rounded-sm shadow-lg'>
				{item.type}
			</div>
		</Rnd>
	);
};

export default RndCanvasItem;
