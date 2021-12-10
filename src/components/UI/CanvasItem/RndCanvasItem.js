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
				x: item.x,
				y: item.y,
				width: item.width,
				height: item.height,
			}}
			dragGrid={[5, 5]}
			resizeGrid={[5, 5]}
			bounds='parent'
			onResize={(e, direction, ref, delta, position) => {
				setItem({
					...item,
					height: ref.offsetHeight,
					width: ref.offsetWidth,
				});
			}}
			onDragStop={(event, data) => {
				setItem({ ...item, x: data.x, y: data.y });
				props.onMove(item.id, data.x, data.y);
			}}
		>
			<div className='flex w-full h-full justify-center items-center bg-gray-100 border-2 shadow-lg rounded-sm border-gray-300'>
				{item.type}
			</div>
		</Rnd>
	);
};

export default RndCanvasItem;
