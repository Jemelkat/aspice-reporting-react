import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

const DashboardPieChart = ({ data }) => {
	const COLORS = [
		"#d6d327",
		"#70cf5c",
		"#00c092",
		"#00aab7",
		"#008fbe",
		"#4572a7",
	];
	const RADIAN = Math.PI / 180;
	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}) => {
		const reversedData = [...data].reverse();
		const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill='white'
				textAnchor={"middle"}
				dominantBaseline='central'
				className='text-sm'
			>
				{`${reversedData[index].value}`}
			</text>
		);
	};

	return (
		<ResponsiveContainer width='100%' height='95%'>
			<PieChart>
				<Pie
					dataKey='value'
					isAnimationActive={false}
					data={[...data].reverse()}
					cx='50%'
					cy='50%'
					labelLine={false}
					label={renderCustomizedLabel}
					startAngle={90}
					endAngle={450}
				>
					{data.map((entry, index) => {
						const colorIndex = index + (COLORS.length - data.length);
						return (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[colorIndex % COLORS.length]}
							/>
						);
					})}
				</Pie>
				<Legend></Legend>
				<Tooltip></Tooltip>
			</PieChart>
		</ResponsiveContainer>
	);
};

export default DashboardPieChart;
