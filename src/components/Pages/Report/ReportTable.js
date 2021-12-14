import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";

class ReportObject {
	constructor(data) {
		this.id = data.reportId;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportTemplateName = data.reportTemplateName;
		this.reportShared = data.reportShared;
	}
}
const ReportTable = (props) => {
	const { url } = useRouteMatch();
	const [{ data, loading, error }, refetch] = useAxios("/report/getAll", {
		useCache: false,
	});

	const [selectedRow, setSelectedRow] = useState(null);

	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Report name",
				accessor: "reportName",
			},
			{
				Header: "Based on template",
				accessor: "reportTemplateName",
			},
			{
				Header: "Created at",
				accessor: "reportCreated",
			},
			{
				Header: "Shared with group",
				accessor: "reportShared",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
						<Link
							to={`${url}/create`}
							onClick={() => {
								debugger;
								props.onModeChange("edit", row.original.id);
							}}
						>
							<TableMenuItem key='1' itemText='Edit'>
								Edit
							</TableMenuItem>
						</Link>
						<TableMenuItem
							key='2'
							id='reportDeleteButton'
							addClasses='text-red-800'
							onClickAction={(e) => {
								setSelectedRow(row.original);
							}}
							itemText='Delete'
						>
							Delete
						</TableMenuItem>
					</TableMenuButton>
				),
			},
		],
		[]
	);

	const parseData = (data) => {
		let objectArray = [];
		if (data) data.forEach((item) => objectArray.push(new ReportObject(item)));
		return objectArray;
	};

	return (
		<>
			<Title text='Reports'></Title>
			<div className='flex justify-end px-2 py-4'>
				<Link to={`${url}/create`}>
					<Button className='mr-2'>Create new report</Button>
				</Link>
				<Button onClick={refetch}>Refresh data</Button>
			</div>
			<div className='flex items-start flex-grow px-2 py-2 min-w-min'>
				<Table columns={columns} data={parseData(data)} isLoading={loading} />
			</div>
		</>
	);
};

export default ReportTable;
