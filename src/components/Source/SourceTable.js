import { useMemo, useState } from "react";
import { useAlert } from "react-alert";
import { axiosInstance, useAxios } from "../../helpers/AxiosHelper";
import Button from "../UI/Button";
import ConfirmDialog from "../UI/Dialog/ConfirmDialog";
import MyDialog from "../UI/Dialog/MyDialog";
import Table from "../UI/Table/Table";
import TableMenuButton from "../UI/Table/TableMenuButton";
import TableMenuItem from "../UI/Table/TableMenuItem";
import Title from "../UI/Title";
import ShareDialog from "../UI/Dialog/ShareDialog";

class SourceObject {
	constructor(source) {
		this.id = source.sourceId;
		this.sourceName = source.sourceName;
		this.sourceCreated = source.sourceCreated;
		this.sourceLastUpdated = source.sourceLastUpdated;
		this.shared = source.shared ? "Yes" : "";
		this.sharedBy = source.sharedBy;
	}
}

const SourceTable = ({ onAddSource, data, loading, onRefetch }) => {
	const [selectedRow, setSelectedRow] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showShareDialog, setShowShareDialog] = useState(false);

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
								setSelectedRow(row.original);
								setShowShareDialog(true);
							}}
						>
							Share
						</TableMenuItem>
						<TableMenuItem
							key='2'
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

	const deleteSourceHandler = () => {
		axiosInstance
			.delete("/source/delete", {
				params: { sourceId: selectedRow.id },
			})
			.then((response) => {
				alert.info(response.data.message);
				setShowDeleteDialog(false);
				onRefetch();
			})
			.catch(() => {
				alert.error("There was error deleting source!");
				setShowDeleteDialog(false);
			});
	};

	const shareSourceHandler = () => {
		//TODO
		console.log("Sharing source");
	};

	const parseSourceData = (sourceData) => {
		let sourceArray = [];
		if (sourceData)
			sourceData.forEach((source) =>
				sourceArray.push(new SourceObject(source))
			);
		return sourceArray;
	};

	const options = [
		{ value: "one", label: "Option One" },
		{ value: "two", label: "Option Two" },
	];

	const [selected, setSelected] = useState([]);
	const onSelectChangeHandler = (selected) => {
		setSelected(selected);
	};
	return (
		<>
			<Title text='Sources'></Title>
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
				title={`Do you really want to delete source ${
					selectedRow ? selectedRow.sourceName : ""
				}?`}
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onOk={() => {
					deleteSourceHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>

			{/*Share dialog*/}
			{showShareDialog && selectedRow && (
				<ShareDialog
					optionsUrl={`/source/${selectedRow ? selectedRow.id : "x"}/groups`}
					shareUrl={`/source/${selectedRow ? selectedRow.id : "x"}/share`}
					selectedRow={selectedRow}
					showShareDialog={showShareDialog}
					onClose={() => setShowShareDialog(false)}
				></ShareDialog>
			)}
		</>
	);
};

export default SourceTable;
