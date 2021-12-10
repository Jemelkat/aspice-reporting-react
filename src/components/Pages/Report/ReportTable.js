import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { useRouteMatch } from "react-router";

class ReportObject {
	constructor(data) {
		this.id = data.id;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportTemplateName = data.reportTemplateName;
		this.reportShared = data.reportShared;
	}
}
const ReportTable = () => {
	const { url } = useRouteMatch();
	const [{ data, loading, error }, refetch] = useAxios("/report/getAll", {
		useCache: false,
	});
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
				Cell: ({ row }) => <Button>Actions</Button>,
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
			<div className='flex-grow py-2 px-2 min-w-min flex items-start'>
				<Table columns={columns} data={parseData(data)} isLoading={loading} />
			</div>
		</>
	);
};

export default ReportTable;
