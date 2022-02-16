import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const DashboardBarGraph = ({ data, isHorizontal }) => {
	return (
		<ResponsiveContainer width='100%' height='95%'>
			<BarChart
				data={data}
				margin={{
					top: 15,
					right: 15,
					left: 5,
					bottom: isHorizontal ? 50 : 25,
				}}
				layout={isHorizontal ? "horizontal" : "vertical"}
			>
				<CartesianGrid vertical={!isHorizontal} horizontal={isHorizontal} />
				{isHorizontal ? (
					<>
						<XAxis
							type='category'
							dataKey='name'
							minTickGap={-20}
							height={30}
							angle={-90}
							dy={30}
							dx={0}
						></XAxis>
						<YAxis
							type='number'
							allowDecimals={false}
							label={{
								value: "Level",
								position: "outsideMiddle",
								dx: -10,
								angle: -90,
							}}
							width={45}
						/>
					</>
				) : (
					<>
						<XAxis
							type='number'
							allowDecimals={false}
							label={{
								value: "Level",
								position: "outsideMiddle",
								dy: 20,
							}}
							height={15}
						></XAxis>
						<YAxis type='category' dataKey='name' minTickGap={10} width={100} />
					</>
				)}
				<Tooltip />
				<Bar dataKey='value' fill='#4572a7' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default DashboardBarGraph;
