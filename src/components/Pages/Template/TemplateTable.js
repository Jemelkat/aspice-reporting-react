import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import ConfirmDialog from "../../UI/Dialog/ConfirmDialog";
import MyDialog from "../../UI/Dialog/MyDialog";

class TemplateObject {
	constructor(data) {
		this.id = data.templateId;
		this.templateName = data.templateName;
		this.templateCreated = data.templateCreated;
		this.templateUpdated = data.templateLastUpdated;
		this.templateShared = data.templateGroup ? "Yes" : "No";
	}
}

const TemplateTable = (props) => {
	const { url } = useRouteMatch();
	const [{ data, loading, error }, refetch] = useAxios("/template/getAll", {
		useCache: false,
	});
	const [{}, postShare] = useAxios(
		{ url: "/template/share", method: "POST" },
		{
			useCache: false,
			manual: true,
		}
	);

	const [showShareDialog, setShowShareDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
				accessor: "templateUpdated",
			},
			{
				Header: "Shared",
				accessor: "templateShared",
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
		postShare({ params: { templateId: selectedRow.id } }).then(() => {
			setShowShareDialog(false);
			refetch();
		});
	};

	const deleteTemplateHandler = () => {
		axiosInstance.delete("/template/delete", {
			params: { templateId: selectedRow.id },
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

			{/*Share dialog*/}
			<ConfirmDialog
				title={`Do you want to share ${
					selectedRow ? selectedRow.templateName : ""
				} with your group?`}
				isOpen={showShareDialog}
				onClose={() => setShowShareDialog(false)}
				onOk={() => {
					shareTemplateHandler();
				}}
				onCancel={() => setShowShareDialog(false)}
			></ConfirmDialog>

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
		</>
	);
};

export default TemplateTable;
