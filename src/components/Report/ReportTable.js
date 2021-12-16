import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxios } from "../../helpers/AxiosHelper";
import Button from "../UI/Button";
import Table from "../UI/Table/Table";
import Title from "../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuButton from "../UI/Table/TableMenuButton";
import TableMenuItem from "../UI/Table/TableMenuItem";
import ConfirmDialog from "../UI/Dialog/ConfirmDialog";
import { useAlert } from "react-alert";

class ReportObject {
	constructor(data) {
		this.id = data.reportId;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportUpdated = data.reportLastUpdated;
		this.reportTemplateName = data.reportTemplate
			? data.reportTemplate.templateName
			: "";
		this.reportShared = data.reportGroup ? "Yes" : "No";
	}
}
const ReportTable = (props) => {
	const [selectedRow, setSelectedRow] = useState(null);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const { url } = useRouteMatch();
	const alert = useAlert();
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
							{row.original.reportShared === "Yes" ? "Unshare" : "Share"}
						</TableMenuItem>
						<Link
							key='2'
							to={`${url}/create`}
							onClick={() => props.onModeChange("edit", row.original.id)}
						>
							<TableMenuItem>Edit</TableMenuItem>
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
			.post("/report/share", null, { params: { reportId: selectedRow.id } })
			.then((response) => {
				alert.info(response.data.message);
				setShowShareDialog(false);
				refetch();
			})
			.catch(() => {
				alert.error("There was error sharing report!");
				setShowShareDialog(false);
			});
	};

	const deleteReportHandler = () => {
		axiosInstance
			.delete("/report/delete", {
				params: { reportId: selectedRow.id },
			})
			.then((response) => {
				alert.info(response.data.message);
				setShowDeleteDialog(false);
				refetch();
			})
			.catch(() => {
				alert.error("There was error deleting report!");
				setShowDeleteDialog(false);
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
					selectedRow ? selectedRow.reportName : ""
				} with your group?`}
				isOpen={showShareDialog}
				onClose={() => setShowShareDialog(false)}
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
				onClose={() => setShowDeleteDialog(false)}
				onOk={() => {
					deleteReportHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>
		</>
	);
};

export default ReportTable;
