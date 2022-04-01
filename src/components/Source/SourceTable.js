import { useMemo, useState } from "react";
import { useAlert } from "react-alert";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/Dialog/ConfirmDialog";
import Table from "../../ui/Table/Table";
import TableMenuButton from "../../ui/Table/TableMenuButton";
import TableMenuItem from "../../ui/Table/TableMenuItem";
import PageTitle from "../../ui/PageTitle";
import ShareDialog from "../../ui/Dialog/ShareDialog";
import SourceService from "../../services/SourceService";
import { saveAs } from "file-saver";

class SourceObject {
	constructor(data) {
		this.id = data.id;
		this.sourceName = data.sourceName;
		this.sourceCreated = data.sourceCreated;
		this.sourceLastUpdated = data.sourceLastUpdated;
		this.shared = data.shared ? "Yes" : "";
		this.sharedBy = data.sharedBy;
	}
}

const SourceTable = ({ onAddSource, data, loading, onRefetch }) => {
	const [selectedRow, setSelectedRow] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const alert = useAlert();

	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Source name",
				accessor: "sourceName",
			},
			{
				Header: "Created at",
				accessor: "sourceCreated",
			},
			{
				Header: "Last updated",
				accessor: "sourceLastUpdated",
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
						<TableMenuItem
							key='2'
							onClickAction={() => {
								SourceService.download(row.original.id).then(
									(generateResponse) => {
										saveAs(
											generateResponse.data,
											row.original.sourceName + ".csv"
										);
									}
								);
							}}
						>
							Download CSV
						</TableMenuItem>
						<TableMenuItem
							key='3'
							addClasses='text-red-800'
							onClickAction={() => {
								if (
									row.original.shared === "" ||
									row.original.sharedBy === "You"
								) {
									setSelectedRow(row.original);
									setShowDeleteDialog(true);
								} else {
									alert.info("Only the owner of this source can delete it.");
								}
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

	const deleteSourceHandler = async () => {
		try {
			setIsDeleting(true);
			const response = await SourceService.deleteSource(selectedRow.id);
			alert.info(response.data.message);
			setShowDeleteDialog(false);
			setIsDeleting(false);
			onRefetch();
		} catch (e) {
			setShowDeleteDialog(false);
			setIsDeleting(false);
			if (e.response?.data && e.response.data?.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("There was error deleting source!");
			}
		}
	};

	const parseSourceData = (sourceData) => {
		let sourceArray = [];
		if (sourceData)
			sourceData.forEach((source) =>
				sourceArray.push(new SourceObject(source))
			);
		return sourceArray;
	};

	return (
		<>
			<PageTitle text='Sources'></PageTitle>
			{/*Table options*/}
			<div className='flex justify-end px-2 py-4'>
				<Button className='mr-2' onClick={() => onAddSource(true)} dark={true}>
					Add source
				</Button>
				<Button onClick={onRefetch} dark={true}>
					Refresh data
				</Button>
			</div>
			{/*Table*/}
			<div className='flex items-start flex-grow px-2 py-2 min-w-min'>
				<Table
					columns={columns}
					data={parseSourceData(data)}
					isLoading={loading}
					initSortColumn={"id"}
				/>
			</div>

			{/*Delete dialog */}
			<ConfirmDialog
				title={`Do you want to delete source: ${
					selectedRow ? selectedRow.sourceName : ""
				}?`}
				description='This source will be completely removed - all shared groups will lose access to this source.'
				isOpen={showDeleteDialog}
				isProcessing={isDeleting}
				processingText={"Deleting file..."}
				onClose={() => setShowDeleteDialog(false)}
				onOk={() => {
					deleteSourceHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>

			{/*Share dialog*/}
			{showShareDialog && selectedRow && (
				<ShareDialog
					title={`Sharing source: ${selectedRow ? selectedRow.sourceName : ""}`}
					optionsUrl={`/source/${selectedRow ? selectedRow.id : "x"}/groups`}
					shareUrl={`/source/${selectedRow ? selectedRow.id : "x"}/share`}
					showShareDialog={showShareDialog}
					onClose={() => setShowShareDialog(false)}
					onSuccess={() => onRefetch()}
				></ShareDialog>
			)}
		</>
	);
};

export default SourceTable;
