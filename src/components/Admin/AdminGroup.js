import {useMemo, useState} from "react";
import Table from "../UI/Table/Table";
import TableMenuButton from "../UI/Table/TableMenuButton";
import TableMenuItem from "../UI/Table/TableMenuItem";
import MyDialog from "../UI/Dialog/MyDialog";
import AdminGroupForm from "./AdminGroupForm";
import {useAxios} from "../../helpers/AxiosHelper";
import ConfirmDialog from "../UI/Dialog/ConfirmDialog";

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
	EDIT: "edit",
	REMOVE: "delete",
	NONE: "none",
};

const AdminGroup = () => {
	//Fetch group data
	const [{ data, loading, error }, refetch] = useAxios(
		API_URL + "/admin/allGroups",
		{
			useCache: false,
		}
	);
	//Delete
	const [{ deleteData, deleteLoading, deleteError }, executeDelete] = useAxios(
		{
			url: API_URL + "/group/delete",
			method: "DELETE",
		},
		{ manual: true }
	);

	const [action, setAction] = useState(ACTIONS.NONE);
	const [showForm, setShowForm] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});

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
			case "addUserToGroupButton":
				setAction(ACTIONS.ADD);
				break;
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
		switch (action) {
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
							onSuccess={refetch}
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
		}).then(() => {
			refetch();
			setShowForm(false);
		});
	};

	return (
		<div className='flex items-start flex-grow px-10 py-10 min-w-min'>
			<Table
				columns={columns}
				data={parseGroupData(data)}
				isLoading={loading}
				initSortColumn={"id"}
			/>
			{/*Render forms if they need to be shown */}
			{showForm && renderForms(action)}
		</div>
	);
};

export default AdminGroup;
