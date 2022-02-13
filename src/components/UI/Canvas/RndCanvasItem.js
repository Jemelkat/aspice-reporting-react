import { Rnd } from "react-rnd";
import { typeEnum } from "../../../helpers/ClassHelper";

const RndCanvasItem = ({ item, onResize, onMove, onSelect, isSelected }) => {
	const renderContent = () => {
		switch (item.type) {
			case typeEnum.TEXT:
				const style = {
					fontFamily: "DejaVu",
					whiteSpace: "pre-line",
					fontSize: item.textStyle.fontSize
						? item.textStyle.fontSize + "px"
						: "11px",
					lineHeight: "1.2",
					fontWeight: item.textStyle.bold ? "bold" : "",
					fontStyle: item.textStyle.italic ? "italic" : "",
					textDecoration: item.textStyle.underline ? "underline" : "",
					color: item.textStyle.color,
				};

				return <div style={style}>{item.textArea}</div>;
			case typeEnum.CAPABILITY_BAR_GRAPH:
				return (
					<div className='w-full h-full -rotate-45'>
						<svg
							className='pt-4 pb-2 pl-2 pr-2'
							id='chart'
							width='100%'
							height='100%'
							viewBox='0 0 1000 500'
							preserveAspectRatio='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='  M0,500  h100  v-125  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M125,500  h100  v-250  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M250,500  h100  v-500  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M375,500  h100  v-250  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M500,500  h100  v-125  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M625,500  h100  v-375  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M750,500  h100  v-375  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
							<path
								d='  M875,500  h100  v-125  q0,-0 -0,-0  h-100  q-0,0 -0,0  Z'
								fill='#4572a7'
							/>
						</svg>
						<div className='absolute w-32 -mt-4 -ml-16 text-center bg-white border border-black top-1/2 left-1/2'>
							CAPABILITY BAR GRAPH
						</div>
					</div>
				);
			case typeEnum.CAPABILITY_TABLE:
				return (
					<div
						style={{
							fontFamily: "DejaVu",
							whiteSpace: "pre-line",
							fontSize: "11px",
							lineHeight: "1.2",
						}}
					>
						<div className='absolute w-32 -ml-16 text-xl text-center bg-white border border-black -mt-7 top-1/2 left-1/2'>
							CAPABILITY TABLE
						</div>
					</div>
				);
			case typeEnum.SIMPLE_TABLE:
				return (
					<div>
						<div className='absolute w-32 -mt-5 -ml-16 text-2xl text-center bg-white border border-black top-1/2 left-1/2'>
							TABLE
						</div>
						{item.tableColumns && item.tableColumns.length > 0 ? (
							<div className='flex'>
								{item.tableColumns.map((column) => (
									<div className='flex flex-col'>
										<div
											className='bg-white border border-black'
											style={{
												fontFamily: "DejaVu",
												minWidth: `${column.width}px`,
												maxWidth: `${column.width}px`,
												minHeight: "20px",
												fontSize: "11px",
												whiteSpace: "nowrap",
												overflow: "hidden",
											}}
										>
											{column.sourceColumn &&
											column.sourceColumn.id != null &&
											column.sourceColumn.columnName !== "None"
												? column.sourceColumn.columnName
												: "None"}
										</div>
										<div className='text-center border border-black'>...</div>
										<div className='text-center border border-black'>...</div>
										<div className='text-center border border-black'>...</div>
										<div className='text-center border border-black'>...</div>
										<div className='text-center border border-black'>...</div>
									</div>
								))}
							</div>
						) : (
							<></>
						)}
					</div>
				);
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
