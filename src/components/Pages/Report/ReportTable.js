import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import ConfirmDialog from "../../UI/Dialog/ConfirmDialog";

class ReportObject {
	constructor(data) {
		this.id = data.reportId;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportUpdated = data.reportLastUpdated;
		this.reportTemplateName = data.reportTemplateName;
		this.reportShared = data.reportGroup ? "Yes" : "No";
	}
}
const ReportTable = (props) => {
	const { url } = useRouteMatch();
	const [{ data, loading, error }, refetch] = useAxios("/report/getAll", {
		useCache: false,
	});

	const [selectedRow, setSelectedRow] = useState(null);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
				Header: "Last updated",
				accessor: "reportUpdated",
			},
			{
				Header: "Shared",
				accessor: "reportShared",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
						<TableMenuItem
							key='1'
							onClickAction={() => {
								setSelectedRow(row.original);
								setShowShareDialog(true);
							}}
						>
							Share
						</TableMenuItem>
						<Link
							to={`${url}/create`}
							onClick={() => props.onModeChange("edit", row.original.id)}
						>
							<TableMenuItem key='2'>Edit</TableMenuItem>
						</Link>
						<TableMenuItem
							key='3'
							addClasses='text-red-800'
							onClickAction={(e) => {
								setSelectedRow(row.original);
								setShowDeleteDialog(true);
							}}
						>
							Delete
						</TableMenuItem>
					</TableMenuButton>
				),
			},
		],
		[]
	);

	const initialState = useMemo(
		() => [
			{
				sortBy: [
					{
						id: "reportCreated",
						desc: false,
					},
				],
			},
		],
		[]
	);

	const parseData = (data) => {
		let objectArray = [];
		if (data) data.forEach((item) => objectArray.push(new ReportObject(item)));
		return objectArray;
	};

	//Share selected template with group
	const shareReportHandler = () => {
		axiosInstance
			.post("/report/share", { params: { reportId: selectedRow.id } })
			.then((response) => {
				setShowShareDialog(false);
				refetch();
			});
	};

	const deleteReportHandler = () => {
		axiosInstance
			.delete("/report/delete", {
				params: { reportId: selectedRow.id },
			})
			.then((response) => {
				setShowDeleteDialog(false);
				refetch();
			});
	};

	useEffect(() => {
		props.onModeChange("create", null);
	}, []);

	return (
		<>
			<Title text='Reports'></Title>
			<div className='flex justify-end px-2 py-4'>
				<Link to={`${url}/create`}>
					<Button className='mr-2' dark={true}>
						Create new report
					</Button>
				</Link>
				<Button onClick={refetch} dark={true}>
					Refresh data
				</Button>
			</div>
			<div className='flex items-start flex-grow px-2 py-2 min-w-min'>
				<Table
					columns={columns}
					data={parseData(data)}
					isLoading={loading}
					initSortColumn={"id"}
				/>
			</div>
			{/*Share dialog*/}
			<ConfirmDialog
				title={`Do you want to share ${
					selectedRow ? selectedRow.templateName : ""
				} with your group?`}
				isOpen={showShareDialog}
				setIsOpen={setShowShareDialog}
				onOk={() => {
					shareReportHandler();
				}}
				onCancel={() => setShowShareDialog(false)}
			></ConfirmDialog>

			{/*Delete dialog */}
			<ConfirmDialog
				title={`Do you really want to delete report ${
					selectedRow ? selectedRow.reportName : ""
				}?`}
				isOpen={showDeleteDialog}
				setIsOpen={setShowDeleteDialog}
				onOk={() => {
					deleteReportHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>
		</>
	);
};

export default ReportTable;
