import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxios } from "../../helpers/AxiosHelper";
import Button from "../UI/Button";
import Table from "../UI/Table/Table";
import Title from "../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuItem from "../UI/Table/TableMenuItem";
import TableMenuButton from "../UI/Table/TableMenuButton";
import ConfirmDialog from "../UI/Dialog/ConfirmDialog";
import { useAlert } from "react-alert";
import ShareDialog from "../UI/Dialog/ShareDialog";

class TemplateObject {
	constructor(data) {
		this.id = data.templateId;
		this.templateName = data.templateName;
		this.templateCreated = data.templateCreated;
		this.templateLastUpdated = data.templateLastUpdated;
		this.shared = data.shared ? "Yes" : "";
		this.sharedBy = data.sharedBy;
	}
}

const TemplateTable = (props) => {
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { url } = useRouteMatch();
	const alert = useAlert();

	const [{ data, loading, error }, refetch] = useAxios("/templates/getAll", {
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
				Header: "Template name",
				accessor: "templateName",
			},
			{
				Header: "Created at",
				accessor: "templateCreated",
			},
			{
				Header: "Last updated",
				accessor: "templateLastUpdated",
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

	const parseData = (data) => {
		let objectArray = [];
		if (data)
			data.forEach((item) => objectArray.push(new TemplateObject(item)));
		return objectArray;
	};

	//Share selected template with group
	const shareTemplateHandler = () => {
		axiosInstance
			.post("/templates/share", null, {
				params: { templateId: selectedRow.id },
			})
			.then((response) => {
				alert.info(response.data.message);
				setShowShareDialog(false);
				refetch();
			})
			.catch(() => {
				alert.error("There was error sharing template!");
				setShowShareDialog(false);
			});
	};

	const deleteTemplateHandler = () => {
		axiosInstance
			.delete("/templates/delete", {
				params: { templateId: selectedRow.id },
			})
			.then((response) => {
				alert.info(response.data.message);
				setShowDeleteDialog(false);
				refetch();
			})
			.catch(() => {
				alert.error("There was error deleting template!");
				setShowShareDialog(false);
			});
	};

	return (
		<>
			<Title text='Templates'></Title>
			<div className='flex justify-end px-2 py-4'>
				<Link to={`${url}/create`}>
					<Button
						className='mr-2'
						onClick={() => props.onModeChange("create", null)}
						dark={true}
					>
						Create new template
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
				title={`Do you really want to delete template ${
					selectedRow ? selectedRow.templateName : ""
				}?`}
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onOk={() => {
					deleteTemplateHandler();
				}}
				onCancel={() => setShowDeleteDialog(false)}
			></ConfirmDialog>

			{showShareDialog && selectedRow && (
				<ShareDialog
					title={`Sharing template: ${
						selectedRow ? selectedRow.templateName : ""
					}`}
					optionsUrl={`/templates/${selectedRow ? selectedRow.id : "x"}/groups`}
					shareUrl={`/templates/${selectedRow ? selectedRow.id : "x"}/share`}
					showShareDialog={showShareDialog}
					onClose={() => setShowShareDialog(false)}
					onSuccess={() => refetch()}
				></ShareDialog>
			)}
		</>
	);
};

export default TemplateTable;
