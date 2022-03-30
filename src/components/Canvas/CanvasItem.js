import {Rnd} from "react-rnd";
import {typeEnum} from "../../helpers/ClassHelper";
import {ReactComponent as SVGSourceBarHorizontal} from "../../assets/barchart-horizontal-sources.svg";
import {ReactComponent as SVGSourceBarVertical} from "../../assets/barchart-vertical-sources.svg";
import {ReactComponent as SVGBarHorizontal} from "../../assets/barchart-horizontal.svg";
import {ReactComponent as SVGBarVertical} from "../../assets/barchart-vertical.svg";
import {ReactComponent as SVGPie} from "../../assets/piechart.svg";
import {useEffect, useRef} from "react";

const CanvasItem = ({ item, onResize, onMove, onSelect, isSelected }) => {
	const itemRef = useRef(null);
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
			case typeEnum.SOURCE_LEVEL_BAR_GRAPH:
				return (
					<div className='w-full h-full'>
						{item.orientation === "HORIZONTAL" ? (
							<SVGSourceBarHorizontal></SVGSourceBarHorizontal>
						) : (
							<SVGSourceBarVertical></SVGSourceBarVertical>
						)}
						<div
							style={{
								fontFamily: "DejaVu",
								whiteSpace: "pre-line",
							}}
							className='absolute w-32 -mt-4 -ml-16 text-center bg-white border border-black top-1/2 left-1/2'
						>
							SOURCES LEVEL BAR GRAPH
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
			case typeEnum.LEVEL_PIE_GRAPH:
				return (
					<div className='w-full h-full'>
						<SVGPie></SVGPie>
						<div
							style={{
								fontFamily: "DejaVu",
								whiteSpace: "pre-line",
							}}
							className='absolute w-32 -mt-4 -ml-16 text-center bg-white border border-black top-1/2 left-1/2'
						>
							LEVEL PIE GRAPH
						</div>
					</div>
				);

			default:
				return <div>UNKNOWN ITEM TYPE</div>;
		}
	};

	//Hooks to update size and position on orientation change
	useEffect(() => {
		itemRef.current.updatePosition({ x: item.x, y: item.y });
	}, [item.x, item.y]);
	useEffect(() => {
		itemRef.current.updateSize({ width: item.width, height: item.height });
	}, [item.height, item.width]);

	return (
		<Rnd
			ref={itemRef}
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

export default CanvasItem;
