import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxios } from "../../helpers/AxiosHelper";
import Button from "../../ui/Button";
import Table from "../../ui/Table/Table";
import PageTitle from "../../ui/PageTitle";
import { useRouteMatch } from "react-router";
import TableMenuButton from "../../ui/Table/TableMenuButton";
import TableMenuItem from "../../ui/Table/TableMenuItem";
import ConfirmDialog from "../../ui/Dialog/ConfirmDialog";
import { useAlert } from "react-alert";

class ReportObject {
	constructor(data) {
		this.id = data.id;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportUpdated = data.reportLastUpdated;
		this.shared = data.shared ? "Yes" : "";
		this.sharedBy = data.sharedBy;
	}
}
const ReportTable = (props) => {
	const [selectedRow, setSelectedRow] = useState(null);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const { url } = useRouteMatch();
	const alert = useAlert();
	const [{ data, loading, error }, refetch] = useAxios("/reports/getAll", {
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
				Header: "Created at",
				accessor: "reportCreated",
			},
			{
				Header: "Last updated",
				accessor: "reportUpdated",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
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

	const parseData = (data) => {
		let objectArray = [];
		if (data) data.forEach((item) => objectArray.push(new ReportObject(item)));
		return objectArray;
	};

	const deleteReportHandler = () => {
		setIsProcessing(true);
		axiosInstance
			.delete("reports/delete", {
				params: { reportId: selectedRow.id },
			})
			.then((response) => {
				alert.info(response.data.message);
				setShowDeleteDialog(false);
				setIsProcessing(false);
				refetch();
			})
			.catch(() => {
				alert.error("There was error deleting report!");
				setIsProcessing(false);
				setShowDeleteDialog(false);
			});
	};

	useEffect(() => {
		props.onModeChange("create", null);
	}, []);

	if (error) {
		alert.error("Error getting report data");
	}

	return (
		<>
			<PageTitle text='Reports'></PageTitle>
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

			{/*Delete dialog */}
			<ConfirmDialog
				title={`Do you want to delete report: ${
					selectedRow ? selectedRow.reportName : ""
				}?`}
				description='This report will be completely removed.'
				isOpen={showDeleteDialog}
				isProcessing={isProcessing}
				processingText={"Deleting report..."}
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
