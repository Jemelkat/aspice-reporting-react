import { useEffect, useMemo, useState } from "react";
import Table from "../../ui/Table/Table";
import TableMenuButton from "../../ui/Table/TableMenuButton";
import TableMenuItem from "../../ui/Table/TableMenuItem";
import MyDialog from "../../ui/Dialog/MyDialog";
import AdminGroupForm from "./AdminGroupForm";
import { useAxios } from "../../helpers/AxiosHelper";
import ConfirmDialog from "../../ui/Dialog/ConfirmDialog";
import { useAlert } from "react-alert";
import Button from "../../ui/Button";

const API_URL = "http://localhost:8080";

class Group {
	constructor(groupData) {
		this.id = groupData.id;
		this.name = groupData.groupName;
		this.users = groupData.users;
		this.numberOfUsers = groupData.users.length;
	}
}

const ACTIONS = {
	CREATE: "create",
	EDIT: "edit",
	REMOVE: "delete",
	NONE: "none",
};

const AdminGroup = () => {
	//Fetch group data
	const [{ data, loading, error }, refetch] = useAxios(
		API_URL + "/admin/allGroups",
		{
			manual: true,
			useCache: false,
		}
	);
	//Delete
	const [
		{ data: deleteData, loading: deleteLoading, error: deleteError },
		executeDelete,
	] = useAxios(
		{
			url: API_URL + "/group/delete",
			method: "DELETE",
		},
		{ manual: true }
	);

	const [action, setAction] = useState(ACTIONS.NONE);
	const [showForm, setShowForm] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});
	const alert = useAlert();

	//Create columns
	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Group name",
				accessor: "name",
			},
			{
				Header: "Number of users",
				accessor: "numberOfUsers",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
						<TableMenuItem
							key='1'
							id='userEditButton'
							onClickAction={(e) => {
								handleActions(e);
								setSelectedGroup(row.original);
							}}
						>
							Edit
						</TableMenuItem>
						<TableMenuItem
							key='2'
							id='userDeleteButton'
							addClasses='text-red-800'
							onClickAction={(e) => {
								handleActions(e);
								setSelectedGroup(row.original);
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

	//Format loaded data for table
	const parseGroupData = (groupData) => {
		let groupArray = [];
		if (groupData !== null && groupData !== undefined) {
			groupData.forEach((group) => groupArray.push(new Group(group)));
		}
		return groupArray;
	};

	//Check what kind of button was clicked
	const handleActions = (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case "userDeleteButton":
				setAction(ACTIONS.REMOVE);
				break;
			case "userEditButton":
				setAction(ACTIONS.EDIT);
				break;
			default:
				break;
		}
		setShowForm(true);
	};

	//Render form based on action
	const renderForms = (action) => {
		debugger;
		switch (action) {
			case ACTIONS.CREATE:
				return (
					<MyDialog
						title='Create group'
						isOpen={showForm}
						onClose={() => setShowForm(false)}
					>
						<AdminGroupForm
							create={true}
							data={selectedGroup}
							onCancel={formCancelHandler}
							onSuccess={refetchHandler}
						></AdminGroupForm>
					</MyDialog>
				);
			case ACTIONS.EDIT:
				return (
					<MyDialog
						title='Edit group'
						isOpen={showForm}
						onClose={() => setShowForm(false)}
					>
						<AdminGroupForm
							data={selectedGroup}
							onCancel={formCancelHandler}
							onSuccess={refetchHandler}
						></AdminGroupForm>
					</MyDialog>
				);
			case ACTIONS.REMOVE:
				return (
					<ConfirmDialog
						title='Do you want to delete group?'
						description='This action will unshare all shared resources with this group.'
						isOpen={showForm}
						onClose={() => setShowForm(false)}
						onOk={groupDeleteHandler}
						onCancel={() => setShowForm(false)}
					></ConfirmDialog>
				);
			default:
				return <></>;
		}
	};

	//Hide form handler
	const formCancelHandler = () => {
		setShowForm(false);
	};

	const groupDeleteHandler = () => {
		executeDelete({
			params: {
				id: selectedGroup.id,
			},
		})
			.then(() => {
				refetch();
				setShowForm(false);
			})
			.catch((e) => {
				alert.error("Error deleting group.");
			});
	};

	const refetchHandler = () => {
		refetch().catch((e) => {
			alert.error("Error getting data.");
		});
	};

	useEffect(() => {
		refetchHandler();
	}, []);

	return (
		<>
			<div className='w-full px-10'>
				<div className='flex justify-end px-2 py-4 space-x-1'>
					<Button
						onClick={() => {
							setSelectedGroup({});
							setAction(ACTIONS.CREATE);
							setShowForm(true);
						}}
						dark={true}
					>
						Create group
					</Button>
					<Button onClick={refetch} dark={true}>
						Refresh data
					</Button>
				</div>
				<div className='flex items-start flex-grow pb-10 min-w-min'>
					<Table
						columns={columns}
						data={parseGroupData(data)}
						isLoading={loading}
						initSortColumn={"id"}
					/>
					{/*Render forms if they need to be shown */}
					{showForm && renderForms(action)}
				</div>
			</div>
		</>
	);
};

export default AdminGroup;
