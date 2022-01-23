import { Rnd } from "react-rnd";
import { typeEnum } from "../../Template/TemplateCreate";

const RndCanvasItem = ({ item, onResize, onMove, onSelect, isSelected }) => {
	const renderContent = () => {
		switch (item.type) {
			case typeEnum.STATIC_TEXT:
				return (
					<div
						style={{
							whiteSpace: "pre-line",
							fontSize: "11.5px",
							lineHeight: "11.5px",
						}}
					>
						{item.textArea}
					</div>
				);
			case typeEnum.GRAPH:
				return (
					<div className='flex items-center justify-center'>{item.type}</div>
				);
			case typeEnum.TABLE:
				return <div>{item.type}</div>;
			default:
				return <div>UNKNOWN ITEM TYPE</div>;
		}
	};

	return (
		<Rnd
			className='overflow-hidden'
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
				const x = position.x < 0 ? 0 : position.x;
				const y = position.y < 0 ? 0 : position.y;
				onResize(item.id, x, y, ref.offsetHeight, ref.offsetWidth);
			}}
			onDrag={(event, data) => {
				//Prevent -x and -y
				const x = data.x < 0 ? 0 : data.x;
				const y = data.y < 0 ? 0 : data.y;
				onMove(item.id, x, y);
			}}
			onClick={(e) => {
				e.stopPropagation();
				onSelect(item.id);
			}}
		>
			<div
				className={`${
					isSelected ? "border-gray-400" : "border-gray-300 "
				}  w-full h-full border-2 border-gray-200 rounded-sm shadow-lg bg-gray-50 `}
			>
				{renderContent()}
			</div>
		</Rnd>
	);
};

export default RndCanvasItem;
