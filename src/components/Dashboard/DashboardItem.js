import { PencilIcon, RefreshIcon } from "@heroicons/react/solid";
import { useEffect, useState, useRef } from "react";
import { useAlert } from "react-alert";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { typeEnum } from "../../helpers/ClassHelper";
import { getItemData } from "../../services/DashboardService";
import Loader from "../UI/Loader/Loader";

const DashboardItem = ({ item, onSelectItem, onDeleteItem, onSave }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isDefined, setIsDefined] = useState(false);
	const [data, setData] = useState(null);
	const alert = useAlert();

	const isItemDefined = (item) => {
		let result = false;
		switch (item.type) {
			case typeEnum.CAPABILITY_BAR_GRAPH:
				result =
					item.source.id != null &&
					item.processColumn.id != null &&
					item.levelColumn.id != null &&
					item.attributeColumn.id != null &&
					item.scoreColumn.id != null;
		}
		return result;
	};

	const loadItemData = async (id) => {
		setIsLoading(true);
		try {
			const response = await getItemData(id);
			const responseData = response.data;
			let graphData = [];
			for (const property in responseData) {
				graphData.push({ name: property, level: responseData[property] });
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

	const firstUpdate = useRef(true);
	useEffect(() => {
		setData(null);
		const defined = isItemDefined(item);
		setIsDefined(defined);
		if (firstUpdate.current) {
			firstUpdate.current = false;
			if (defined) {
				loadItemData(item.id);
			}
		}
	}, [
		item.source.id,
		item.processColumn.id,
		item.levelColumn.id,
		item.attributeColumn.id,
		item.scoreColumn.id,
	]);

	return (
		<div className='flex flex-col h-full'>
			<div className='w-full text-white bg-gray-800 h-7'>
				<div className='pl-1 mr-10 overflow-hidden'>{item.type}</div>
				<span>
					<PencilIcon
						onClick={(e) => {
							onSelectItem(item.id);
							e.stopPropagation();
							e.preventDefault();
						}}
						className='absolute w-5 h-5 bg-gray-800 cursor-pointer top-1 right-7'
					></PencilIcon>
					<span
						class='z-0 border-1 drop-shadow-l absolute top-1 right-1 bg-gray-800  cursor-pointer '
						onClick={(e) => {
							onDeleteItem(item.id);
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</span>
				</span>
			</div>

			{isLoading ? (
				<div className='h-full'>
					<Loader size='small'>Loading graph data...</Loader>
				</div>
			) : isDefined ? (
				data != null ? (
					<div className='h-full pt-4 pb-4 pr-4'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={data}
								margin={{
									top: 5,
									right: 5,
									left: 5,
									bottom: 40,
								}}
							>
								<CartesianGrid vertical={false} />
								<XAxis dataKey='name' angle='-45' dy={20} height={30}></XAxis>
								<YAxis
									allowDecimals={false}
									label={{
										value: "Level",
										angle: -90,
										position: "insideLeft",
										dx: 10,
									}}
								/>
								<Tooltip />

								<Bar dataKey='level' fill='#4572a7' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				) : (
					<div className='flex flex-col items-center justify-center h-full'>
						<RefreshIcon
							onClick={(e) => {
								onSave().then(() => loadItemData(item.id));
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
					<span>Please define the graph sources</span>
				</div>
			)}
		</div>
	);
};

export default DashboardItem;
