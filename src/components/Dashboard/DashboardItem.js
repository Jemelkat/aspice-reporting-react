import {PencilIcon, RefreshIcon, UploadIcon} from "@heroicons/react/solid";
import {useEffect, useRef, useState} from "react";
import {useAlert} from "react-alert";
import {typeEnum} from "../../helpers/ClassHelper";
import Loader from "../../ui/Loader/Loader";
import DashboardBarGraph from "./DashboardBarGraph";
import DashboardPieChart from "./DashboardPieChart";
import DashboardService from "../../services/DashboardService";

const DashboardItem = ({
	item,
	onSelectItem,
	onDeleteItem,
	onSave,
	onExport,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isDefined, setIsDefined] = useState(false);
	const [data, setData] = useState(null);
	const alert = useAlert();

	//All selects need to be valid for item to be defined - we can get data for this item
	const isItemDefined = (item) => {
		let result = false;
		switch (item.type) {
			case typeEnum.LEVEL_PIE_GRAPH:
				result =
					item.source?.id &&
					item.assessorColumn?.id &&
					item.processColumn?.id &&
					item.criterionColumn?.id &&
					item.attributeColumn?.id &&
					item.scoreColumn?.id;
				break;
			case typeEnum.LEVEL_BAR_GRAPH:
				result =
					item.sources?.length > 0 &&
					item.processColumnName &&
					item.assessorColumnName &&
					item.attributeColumnName &&
					item.criterionColumnName &&
					item.scoreColumnName;
				break;
		}
		return result;
	};

	//Loads dashboard item graph data from server
	const loadItemData = async (requestedItem) => {
		setIsLoading(true);
		try {
			const response = await DashboardService.getItemData(requestedItem.id);
			const responseData = response.data;
			let graphData = [];

			for (let i = 0; i < responseData.length; i++) {
				const data = responseData[i];
				switch (requestedItem.type) {
					/*Level graph needs data in format 
					{process: XXX
					assessor1: xxx
					assessor2: xxx..}*/
					case typeEnum.LEVEL_BAR_GRAPH: {
						var exists = graphData.find((obj) => {
							return obj?.process === data.process;
						});
						if (exists) {
							graphData = graphData.map((obj) => {
								if (obj.process === data.process) {
									return { ...obj, [data.assessor]: parseInt(data.level) };
								} else {
									return obj;
								}
							});
						} else {
							graphData.push({
								process: data.process,
								[data.assessor]: parseInt(data.level),
							});
						}
						console.log(graphData);
						break;
					}
					/*Pie graph needs data in format 
					{name: xxx,
					value: xxx}*/
					case typeEnum.LEVEL_PIE_GRAPH:
						graphData.push({ name: data.level, value: parseInt(data.count) });
						break;
				}
			}
			setData(graphData);
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			if (e.response && e.response.data && e.response.data.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error loading item data.");
			}
		}
	};

	//Load data on first render if item is fully defined
	const firstUpdate = useRef(true);
	useEffect(() => {
		setData(null);
		const defined = isItemDefined(item);
		setIsDefined(defined);
		if (firstUpdate.current) {
			firstUpdate.current = false;
			if (defined) {
				loadItemData(item);
			}
		}
	}, [
		item.sources,
		item.assessorColumnName,
		item.processColumnName,
		item.attributeColumnName,
		item.criterionColumnName,
		item.scoreColumnName,
		item.source,
		item.assessorColumn,
		item.processColumn,
		item.criterionColumn,
		item.attributeColumn,
		item.scoreColumn,
	]);

	//Render correct graph
	const renderGraph = () => {
		switch (item.type) {
			case typeEnum.LEVEL_BAR_GRAPH:
				return (
					<DashboardBarGraph
						data={data}
						isHorizontal={item.orientation === "HORIZONTAL"}
					></DashboardBarGraph>
				);
			case typeEnum.LEVEL_PIE_GRAPH:
				return <DashboardPieChart data={data}></DashboardPieChart>;
			default:
				alert.info("Unknown item type");
				break;
		}
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='w-full text-white bg-gray-800 h-7'>
				<div className='pl-1 mr-10 overflow-hidden'>{item.type}</div>
				<div className='absolute top-0 right-0 h-6 bg-gray-800'>
					<div className='flex pt-0.5'>
						{isDefined && (
							<RefreshIcon
								onClick={(e) => {
									onSave(item.id).then((newItem) => {
										loadItemData(newItem);
									});
									e.preventDefault();
									e.stopPropagation();
								}}
								className='w-5 h-5 mr-1 cursor-pointer'
							></RefreshIcon>
						)}
						<UploadIcon
							onClick={(e) => {
								onSelectItem(item.id);
								onExport();
								e.preventDefault();
								e.stopPropagation();
							}}
							className='w-5 h-5 mr-1 cursor-pointer '
						></UploadIcon>
						<PencilIcon
							onClick={(e) => {
								onSelectItem(item.id);
								e.stopPropagation();
								e.preventDefault();
							}}
							className='w-5 h-5 mr-1 cursor-pointer '
						></PencilIcon>

						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-5 h-5 cursor-pointer '
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							onClick={(e) => {
								onDeleteItem(item.id);
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</div>
				</div>
			</div>
			{isLoading ? (
				<div className='h-full'>
					<Loader size='small'>Loading graph data...</Loader>
				</div>
			) : isDefined ? (
				data !== null ? (
					<div className='h-full'>{renderGraph()}</div>
				) : (
					<div className='flex flex-col items-center justify-center h-full'>
						<RefreshIcon
							onClick={(e) => {
								onSave(item.id).then((newItem) => {
									loadItemData(newItem);
								});
								e.stopPropagation();
								e.preventDefault();
							}}
							className='w-10 h-10 cursor-pointer'
						></RefreshIcon>
						Render graph
					</div>
				)
			) : (
				<div className='flex flex-col items-center justify-center h-full'>
					<PencilIcon
						onClick={(e) => {
							onSelectItem(item.id);
							e.stopPropagation();
							e.preventDefault();
						}}
						className='w-10 h-10 cursor-pointer'
					></PencilIcon>
					<span className='text-center'>Please define the graph sources</span>
				</div>
			)}
		</div>
	);
};

export default DashboardItem;
