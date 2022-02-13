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
		"#4572a7",
		"#008fbe",
		"#00aab7",
		"#00c092",
		"#70cf5c",
		"#d6d327",
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
		debugger;
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
				className='text-xs'
			>
				{`${data[index].value}`}
			</text>
		);
	};

	return (
		<ResponsiveContainer width='100%' height='95%'>
			<PieChart>
				<Pie
					dataKey='value'
					isAnimationActive={false}
					data={data}
					cx='50%'
					cy='50%'
					labelLine={false}
					label={renderCustomizedLabel}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Legend></Legend>
				<Tooltip></Tooltip>
			</PieChart>
		</ResponsiveContainer>
	);
};

export default DashboardPieChart;
