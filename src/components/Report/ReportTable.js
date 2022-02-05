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
import ShareDialog from "../UI/Dialog/ShareDialog";

class ReportObject {
	constructor(data) {
		this.id = data.id;
		this.reportName = data.reportName;
		this.reportCreated = data.reportCreated;
		this.reportUpdated = data.reportLastUpdated;
		this.reportTemplateName = data.reportTemplate
			? data.reportTemplate.templateName
			: "";
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
				accessor: "shared",
			},
			{
				Header: "Shared by",
				accessor: "sharedBy",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
						<TableMenuItem
							key='1'
							onClickAction={() => {
								if (
									row.original.shared === "" ||
									row.original.sharedBy === "You"
								) {
									setSelectedRow(row.original);
									setShowShareDialog(true);
								} else {
									alert.info("Only the owner of this source can share it.");
								}
							}}
						>
							Share
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

			{/*Delete dialog */}
			<ConfirmDialog
				title={`Do you want to delete report: ${
					selectedRow ? selectedRow.reportName : ""
				}?`}
				description='This report will be completely removed - all shared groups will lose access to this report.'
				isOpen={showDeleteDialog}
				isProcessing={isProcessing}
				processingText={"Deleting report..."}
				onClose={() => setShowDeleteDialog(false)}
				onOk={() => {
					deleteReportHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>

			{/*Share dialog*/}
			{showShareDialog && selectedRow && (
				<ShareDialog
					title={`Sharing report: ${selectedRow ? selectedRow.reportName : ""}`}
					optionsUrl={`/reports/${selectedRow ? selectedRow.id : "x"}/groups`}
					shareUrl={`/reports/${selectedRow ? selectedRow.id : "x"}/share`}
					showShareDialog={showShareDialog}
					onClose={() => setShowShareDialog(false)}
					onSuccess={() => refetch()}
				></ShareDialog>
			)}
		</>
	);
};

export default ReportTable;
