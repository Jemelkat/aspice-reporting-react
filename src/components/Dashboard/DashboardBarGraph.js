import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import colors from "../../helpers/ColorsHelper";

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
							dataKey='process'
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
							domain={[0, 5]}
							tickCount={6}
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
							domain={[0, 5]}
							tickCount={6}
						></XAxis>
						<YAxis
							type='category'
							dataKey='process'
							minTickGap={-10}
							width={100}
						/>
					</>
				)}
				<Tooltip />
				{data &&
					data.length > 0 &&
					Object.getOwnPropertyNames(data[0])
						.filter((property) => property !== "process")
						.map((barNames, index) => (
							<Bar dataKey={barNames} fill={colors[index % 12]} />
						))}
				<Legend layout='horizontal' verticalAlign='top' align='center' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default DashboardBarGraph;
