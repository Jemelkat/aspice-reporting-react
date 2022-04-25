import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Label,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import colors from "../../helpers/ColorsHelper";

const maxWordLength = 10;

const DashboardBarGraph = ({ data, isHorizontal }) => {
	const [processNamesSize, setProcessNamesSize] = useState(0);
	useEffect(() => {
		const longestName = Math.max(...data.map((it) => it["process"].length));
		if (longestName > maxWordLength) {
			setProcessNamesSize(0);
		} else {
			setProcessNamesSize(longestName * 5);
		}
	}, [data]);

	return (
		<ResponsiveContainer width='100%' height='95%'>
			<BarChart
				data={data}
				margin={{
					top: 15,
					right: 15,
					left: isHorizontal ? 15 : processNamesSize + 30,
					bottom: isHorizontal ? processNamesSize + 20 : 25,
				}}
				layout={isHorizontal ? "horizontal" : "vertical"}
			>
				<CartesianGrid vertical={!isHorizontal} horizontal={isHorizontal} />
				{isHorizontal ? (
					<>
						<XAxis
							dataKey='process'
							textAnchor='end'
							angle='-90'
							height={processNamesSize > 0 ? processNamesSize : 10}
							interval={0}
							dy={processNamesSize > 0 ? 0 : processNamesSize + 100}
						>
							<Label value='Process' position='bottom' dy={processNamesSize} />
						</XAxis>
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
							height={1}
							domain={[0, 5]}
							tickCount={6}
						>
							<Label value='Level' dy={20} position='outsideMiddle' />
						</XAxis>
						<YAxis
							type='category'
							dataKey='process'
							textAnchor='end'
							interval={0}
							width={processNamesSize > 0 ? processNamesSize : 5}
							dx={processNamesSize > 0 ? 0 : processNamesSize - 100}
						>
							<Label
								value='Process'
								position='left'
								angle={-90}
								dx={-processNamesSize - 10}
							/>
						</YAxis>
					</>
				)}
				<Tooltip />
				{data &&
					data.length > 0 &&
					Object.getOwnPropertyNames(data[0])
						.filter((property) => property !== "process")
						.map((barNames, index) => (
							<Bar dataKey={barNames} fill={colors[index % 12]}></Bar>
						))}
				<Legend layout='horizontal' verticalAlign='top' align='center' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default DashboardBarGraph;
